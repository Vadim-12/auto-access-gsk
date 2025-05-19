import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import fetch from 'node-fetch';
import { UseGuards } from '@nestjs/common';
import { AuthWsGuard } from '../auth/guards/auth-ws.guard';

@WebSocketGateway()
@UseGuards(AuthWsGuard)
export class CameraGateway {
  @WebSocketServer()
  server: Server;

  private cameraStreams = new Map<string, AbortController>();

  @SubscribeMessage('start-stream')
  async startStream(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { cameraIp, cameraPort } = data;

    const controller = new AbortController();
    this.cameraStreams.set(client.id, controller);

    const res = await fetch(`http://${cameraIp}:${cameraPort}/stream`, {
      signal: controller.signal,
    });

    const boundary = '--frame';
    let buffer = Buffer.alloc(0);

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
        }
      }
    });
  }

  stopStream(@ConnectedSocket() client: Socket) {
    const controller = this.cameraStreams.get(client.id);
    if (controller) {
      controller.abort();
      this.cameraStreams.delete(client.id);
    }
  }

  handleDisconnect(client: Socket) {
    this.stopStream(client);
  }
}
