import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { AuthWsGuard } from '../auth/guards/auth-ws.guard';
import axios from 'axios';

interface ActiveConnection {
  socket: Socket;
  stream: any;
  cameraIp: string;
  cameraPort: number;
  frameCount: number;
  lastFrameTime: number;
  totalFrameSize: number;
}

interface FrameBuffer {
  data: Buffer;
  size: number;
  timestamp: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})
@UseGuards(AuthWsGuard)
export class CameraGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CameraGateway.name);
  private readonly CONNECTION_TIMEOUT = 15000;
  private readonly activeConnections = new Map<string, ActiveConnection>();
  private readonly frameBuffers = new Map<string, FrameBuffer>();

  handleConnection(client: Socket) {
    this.logger.log(`[Camera] Client connected: ${client.id}`);
    this.activeConnections.set(client.id, {
      socket: client,
      stream: null,
      cameraIp: '',
      cameraPort: 0,
      frameCount: 0,
      lastFrameTime: Date.now(),
      totalFrameSize: 0,
    });
    client.emit('connection-established', { success: true });
  }

  private async cleanupConnection(clientId: string) {
    const connection = this.activeConnections.get(clientId);
    if (connection) {
      if (connection.stream) {
        connection.stream.destroy();
      }
      this.activeConnections.delete(clientId);
      this.frameBuffers.delete(clientId);
      this.logger.log(`[Camera] Connection cleaned up: ${clientId}`);
    }
  }

  private processFrame(clientId: string, chunk: Buffer) {
    const buffer = this.frameBuffers.get(clientId) || {
      data: Buffer.alloc(0),
      size: 0,
      timestamp: Date.now(),
    };

    buffer.data = Buffer.concat([buffer.data, chunk]);
    buffer.size += chunk.length;

    const startMarker = Buffer.from([0xff, 0xd8]);
    const endMarker = Buffer.from([0xff, 0xd9]);

    const startIndex = buffer.data.indexOf(startMarker);
    const endIndex = buffer.data.indexOf(endMarker, startIndex);

    if (startIndex !== -1 && endIndex !== -1) {
      const frame = buffer.data.slice(startIndex, endIndex + 2);
      const frameSize = frame.length;

      if (frameSize > 1024) {
        const base64Frame = frame.toString('base64');
        const client = this.activeConnections.get(clientId);
        if (client?.socket) {
          client.socket.emit('camera-frame', base64Frame);
        }
      }

      buffer.data = buffer.data.slice(endIndex + 2);
      buffer.size = buffer.data.length;
      buffer.timestamp = Date.now();
    }

    this.frameBuffers.set(clientId, buffer);
  }

  @SubscribeMessage('start-stream')
  async startStream(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { cameraIp: string; cameraPort: number },
  ) {
    const clientId = client.id;
    this.logger.log(
      `[Camera] Starting stream: ${clientId} -> ${data.cameraIp}:${data.cameraPort}`,
    );

    try {
      this.activeConnections.set(clientId, {
        socket: client,
        stream: null,
        cameraIp: data.cameraIp,
        cameraPort: data.cameraPort,
        frameCount: 0,
        lastFrameTime: Date.now(),
        totalFrameSize: 0,
      });

      this.frameBuffers.set(clientId, {
        data: Buffer.alloc(0),
        size: 0,
        timestamp: Date.now(),
      });

      const response = await axios({
        method: 'get',
        url: `http://${data.cameraIp}:${data.cameraPort}/stream`,
        responseType: 'stream',
        timeout: 5000,
      });

      this.logger.log(
        `[Camera] Stream connected: ${response.status} ${response.headers['content-type']}`,
      );

      const stream = response.data;
      this.activeConnections.get(clientId)!.stream = stream;

      const frameCount = 0;

      stream.on('data', (chunk: Buffer) => {
        const connection = this.activeConnections.get(clientId);
        if (!connection) {
          this.logger.warn(`[Camera] No connection found: ${clientId}`);
          return;
        }

        try {
          this.processFrame(clientId, chunk);
        } catch (error) {
          this.logger.error(`[Camera] Frame processing error: ${clientId}`, {
            error: error instanceof Error ? error.message : error,
            bufferSize: this.frameBuffers.get(clientId)?.size || 0,
          });
        }
      });

      response.data.on('end', () => {
        this.logger.log(`[Camera] Stream ended: ${clientId}`);
        this.cleanupConnection(clientId);
      });

      response.data.on('error', (error: Error) => {
        this.logger.error(`[Camera] Stream error: ${clientId}`, {
          error: error.message,
          frameCount,
        });
        this.cleanupConnection(clientId);
      });
    } catch (error) {
      this.logger.error(`[Camera] Stream start error: ${clientId}`, {
        error: error instanceof Error ? error.message : error,
      });
      client.emit('camera-error', 'Не удалось запустить поток камеры');
      this.cleanupConnection(clientId);
    }
  }

  @SubscribeMessage('stop-stream')
  handleStopStream(@ConnectedSocket() client: Socket) {
    this.logger.log(`[Camera] Stream stop requested: ${client.id}`);
    this.cleanupConnection(client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`[Camera] Client disconnected: ${client.id}`);
    this.cleanupConnection(client.id);
  }
}
