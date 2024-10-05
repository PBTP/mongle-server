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
import { ChatMessageDto, ChatRoomDto } from './chat.dto';
import { AuthService } from '../../auth/application/auth.service';
import { Subscribe } from '../decorator/socket.decorator';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ChatService } from '../application/chat.service';
import { UserDto } from '../../auth/presentation/user.dto';
import { serviceWebUrls } from '../../main';

export class UserSocket extends Socket {
  user: UserDto;
}

@WebSocketGateway(5000, {
  cors: {
    credentials: true,
    origin: serviceWebUrls,
    methods: ['GET', 'POST'],
  },
})
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
        userId: user.customerId,
        userType: user.userType ?? 'customer',
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
    @MessageBody() dto: ChatRoomDto,
    @ConnectedSocket() client: UserSocket,
  ): Promise<void> {
    const chatRoomExists = await this.chatService.exists({
      chatRoomId: dto.chatRoomId,
    });

    if (!chatRoomExists) {
      throw new NotFoundException(`Room ${dto.chatRoomId} not found`);
    }

    const userChatRoomExsits = await this.chatService.exitsUserChatRoom(
      client.user,
      dto.chatRoomId,
    );

    if (!userChatRoomExsits) {
      throw new ForbiddenException(
        `You are not in this ${dto.chatRoomId} room`,
      );
    }

    await this.chatService.join(client, dto.chatRoomId.toString());
  }

  // socket room exits (채팅방 나가기 X)
  @Subscribe('exit')
  async handleExit(
    @MessageBody() dto: ChatRoomDto,
    @ConnectedSocket() client: UserSocket,
  ): Promise<void> {
    const user = this.getUser(client);
    this.chatService.exit(client).then(() => {
      this.logger.log(`Client ${user.uuid} exit room ${dto.chatRoomId}`);
    });
  }

  @Subscribe('send')
  async handleMessage(
    @MessageBody() message: ChatMessageDto,
    @ConnectedSocket() client: UserSocket,
  ): Promise<void> {
    message.user = this.getUser(client);

    await this.chatService.findOne({
      chatRoomId: message.chatRoomId,
    });

    if (!client.rooms.has(message.chatRoomId.toString())) {
      throw new ForbiddenException(
        `You are not in this ${message.chatRoomId} room`,
      );
    }

    this.logger.log('Sending message...');
    this.chatService.saveMessage(message).then((v) => {
      this.server.to(v.chatRoomId.toString()).emit('receive', message);
      this.logger.log(
        `Message from ${message.user?.uuid} in room ${message.chatRoomId.toString()} : ${message.chatMessageContent}`,
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
