import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import fetch from 'node-fetch';
import { UseGuards, Logger } from '@nestjs/common';
import { AuthWsGuard } from '../auth/guards/auth-ws.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
@UseGuards(AuthWsGuard)
export class CameraGateway {
  private readonly logger = new Logger(CameraGateway.name);

  @WebSocketServer()
  server: Server;

  private cameraStreams = new Map<string, AbortController>();

  @SubscribeMessage('start-stream')
  async startStream(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { cameraIp, cameraPort } = data;
    this.logger.log(
      `Starting stream for client ${client.id} from camera ${cameraIp}:${cameraPort}`,
    );

    if (this.cameraStreams.has(client.id)) {
      this.logger.warn(`Stream already running for client ${client.id}`);
      this.stopStream(client);
    }

    const controller = new AbortController();
    this.cameraStreams.set(client.id, controller);

    try {
      const streamUrl = `http://${cameraIp}:${cameraPort}/stream`;
      this.logger.log(`Fetching stream from ${streamUrl}`);

      const res = await fetch(streamUrl, {
        signal: controller.signal,
        timeout: 5000,
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch stream: ${res.status} ${res.statusText}`,
        );
      }

      const boundary = '--frame';
      let buffer = Buffer.alloc(0);
      let frameCount = 0;
      let lastFrameTime = Date.now();
      const FRAME_TIMEOUT = 10000;

      res.body.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
        while (buffer.includes(boundary)) {
          const boundaryIndex = buffer.indexOf(boundary);
          const nextBoundaryIndex = buffer.indexOf(
            boundary,
            boundaryIndex + boundary.length,
          );
          if (nextBoundaryIndex < 0) break;

          const frameBuffer = buffer.slice(boundaryIndex, nextBoundaryIndex);
          buffer = buffer.slice(nextBoundaryIndex);
          const jpegMatch = frameBuffer
            .toString()
            .match(/Content-Length: \d+\r\n\r\n/);

          if (jpegMatch) {
            const offset = jpegMatch.index + jpegMatch[0].length;
            const jpeg = frameBuffer.slice(offset);
            client.emit('camera-frame', jpeg);
            frameCount++;
            lastFrameTime = Date.now();
            if (frameCount % 30 === 0) {
              this.logger.log(
                `Sent ${frameCount} frames to client ${client.id}`,
              );
            }
          }
        }

        if (Date.now() - lastFrameTime > FRAME_TIMEOUT) {
          throw new Error('Frame timeout: no frames received for 10 seconds');
        }
      });

      res.body.on('error', (error) => {
        this.logger.error(`Stream error for client ${client.id}:`, error);
        client.emit('stop-stream', `Stream error: ${error.message}`);
        this.stopStream(client);
      });

      res.body.on('end', () => {
        this.logger.log(`Stream ended for client ${client.id}`);
        client.emit('stop-stream', 'Stream ended by camera');
        this.stopStream(client);
      });
    } catch (error) {
      this.logger.error(
        `Error starting stream for client ${client.id}:`,
        error,
      );
      client.emit('stop-stream', `Error: ${error.message}`);
      this.stopStream(client);
    }
  }

  stopStream(@ConnectedSocket() client: Socket) {
    this.logger.log(`Stopping stream for client ${client.id}`);
    const controller = this.cameraStreams.get(client.id);
    if (controller) {
      controller.abort();
      this.cameraStreams.delete(client.id);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
    this.stopStream(client);
  }
}
