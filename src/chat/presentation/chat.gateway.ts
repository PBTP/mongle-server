import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { ChatDto, MessageDto } from './chat.dto';
import { AuthService } from '../../auth/application/auth.service';
import { Subscribe } from '../decorator/socket.decorator';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ChatService } from '../application/chat.service';
import { UserDto } from '../../auth/presentation/user.dto';

export class UserSocket extends Socket {
  user: UserDto;
}

@WebSocketGateway(5000, { namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(ChatGateway.name);

  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: UserSocket) {
    this.logger.log(`Client connected: ${client.id}`);

    try {
      const user = await this.authService.getUser(
        client.handshake.headers.authorization.replace('Bearer ', ''),
      );

      client.user = {
        uuid: user.uuid,
        name: user.customerName,
        userType: user.userType,
      };

      await this.chatService.getUserChatRoomIds(client).then((v) => {
        v.forEach((chatRoomId) => {
          this.chatService.join(client, chatRoomId);
        });
      });
    } catch (e) {
      this.logger.error(e);
      Promise.resolve(client.emit('exception', e)).then(() =>
        client.disconnect(),
      );
    }
  }

  async handleDisconnect(client: UserSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    await this.chatService.exit(client);
    return true;
  }

  @Subscribe('join')
  async handleJoin(
    @MessageBody() dto: ChatDto,
    @ConnectedSocket() client: UserSocket,
  ): Promise<void> {
    if (!(await this.chatService.exists({ chatRoomId: dto.chatRoomId }))) {
      throw new NotFoundException(`Room ${dto.chatRoomId} not found`);
    }

    await this.chatService.join(client, dto.chatRoomId.toString());
  }

  @Subscribe('exit')
  async handleExit(
    @MessageBody() dto: ChatDto,
    @ConnectedSocket() client: UserSocket,
  ): Promise<void> {
    const user = this.getUser(client);

    await this.chatService.exit(client);

    this.logger.log(`Client ${user.uuid} exit room ${dto.chatRoomId}`);
  }

  @Subscribe('send')
  async handleMessage(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() client: UserSocket,
  ): Promise<void> {
    message.user = this.getUser(client);

    const chatRoom = await this.chatService.findOne({
      chatRoomId: message.chatRoomId,
    });

    if (!chatRoom) {
      throw new NotFoundException(`Room ${message.chatRoomId} not found`);
    }

    if (!client.rooms.has(message.chatRoomId.toString())) {
      throw new ForbiddenException(
        `You are not in this ${message.chatRoomId} room`,
      );
    }

    this.logger.log('Sending message...');
    this.chatService.saveMessage(message).then((v) => {
      this.server.to(v.chatRoomId.toString()).emit('receive', message);
      this.logger.log(
        `Message from ${message.user?.uuid} in room ${message.chatRoomId.toString()} : ${message.content}`,
      );
    });
  }

  getUser(client: UserSocket): UserDto {
    const user = client.user;
    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }

    return user;
  }
}
