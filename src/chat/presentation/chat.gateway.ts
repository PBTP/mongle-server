import {
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { ChatDto, MessageDto } from './chat.dto';
import { AuthService } from '../../auth/application/auth.service';
import { Subscribe } from '../decorator/socket.decorator';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ChatService } from '../application/chat.service';

@WebSocketGateway(5000, { namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(ChatGateway.name);

  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    try {
      const user = await this.authService.getUser(
        client.handshake.headers.authorization.replace('Bearer ', ''),
      );

      client['user'] = {
        uuid: user.uuid,
        name: user.customerName,
        userType: user.userType,
      };
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @Subscribe('join')
  async handleJoin(
    @MessageBody() dto: ChatDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = this.getUser(client);
    const roomId = dto.chatRoomId.toString();

    if (!(await this.chatService.exists({ chatRoomId: dto.chatRoomId }))) {
      throw new NotFoundException(`Room ${dto.chatRoomId} not found`);
    }

    if (!client.rooms.has(roomId)) {
      await client.join(roomId);
      this.logger.log(`Client ${user.uuid} joined room ${dto.chatRoomId}`);
      return;
    }
    this.logger.log(`Client ${user.uuid} is already in room ${dto.chatRoomId}`);
  }

  @Subscribe('leave')
  async handleLeave(
    @MessageBody() dto: ChatDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = this.getUser(client);

    await client.leave(dto.chatRoomId.toString());
    this.logger.log(`Client ${user.uuid} leave room ${dto.chatRoomId}`);
  }

  @Subscribe('send')
  handleMessage(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() client: Socket,
  ): void {
    message.user = this.getUser(client);

    if (!this.chatService.exists({ chatRoomId: message.chatRoomId })) {
      throw new NotFoundException(`Room ${message.chatRoomId} not found`);
    }

    if (!client.rooms.has(message.chatRoomId.toString())) {
      throw new ForbiddenException('You are not in this room');
    }
    this.logger.log('Sending message...');

    this.chatService.sendMessage(message).then((v) => {
      this.server.to(v.chatRoomId.toString()).emit('receive', message);
      this.logger.log(
        `Message from ${message.user} in room ${message.chatRoomId.toString()} : ${message.content}`,
      );
    });
  }

  getUser(client: Socket): any {
    const user = client['user'];
    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }

    return user;
  }
}
