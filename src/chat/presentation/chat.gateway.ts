import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, NotFoundException } from '@nestjs/common';
import { ChatDto, MessageDto } from './chat.dto';
import { AuthService } from '../../auth/application/auth.service';
import { Subscribe } from '../decorator/socket.decorator';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ChatService } from '../application/chat.service';
import { UserDto } from '../../auth/presentation/user.dto';
import { CacheService } from '../../common/cache/cache.service';
import { ChatRoomDto } from './chat-room.dto';

export class UserSocket extends Socket {
  user: UserDto;
}

@WebSocketGateway(5000, { namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger(ChatGateway.name);

  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly cacheService: CacheService,
  ) {}

  @WebSocketServer()
  server: Server;

  async afterInit(server: Server) {
    this.logger.log('Init chat gateway:');
  }

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
    } catch (e) {
      this.logger.error(e);
      client.disconnect();
    }
  }

  handleDisconnect(client: UserSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @Subscribe('join')
  async handleJoin(
    @MessageBody() dto: ChatDto,
    @ConnectedSocket() client: UserSocket,
  ): Promise<void> {
    const currentUser = this.getUser(client);

    if (!(await this.chatService.exists({ chatRoomId: dto.chatRoomId }))) {
      throw new NotFoundException(`Room ${dto.chatRoomId} not found`);
    }

    this.findRoomInUser(client, dto).then((v) => {
      !v.user && this.addUser(v.room, currentUser);
    });

    this.logger.log(
      `Client ${currentUser.uuid} is already in room ${dto.chatRoomId}`,
    );
  }

  @Subscribe('leave')
  async handleLeave(
    @MessageBody() dto: ChatDto,
    @ConnectedSocket() client: UserSocket,
  ): Promise<void> {
    const user = this.getUser(client);

    await client.leave(dto.chatRoomId.toString());
    this.logger.log(`Client ${user.uuid} leave room ${dto.chatRoomId}`);
  }

  @Subscribe('send')
  async handleMessage(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() client: UserSocket,
  ): Promise<void> {
    message.user = this.getUser(client);

    const room = await this.chatService.findOne({
      chatRoomId: message.chatRoomId,
    });
    if (!room) {
      throw new NotFoundException(`Room ${message.chatRoomId} not found`);
    }

    this.findRoomInUser(client, room).then((v) => {
      !v.user && this.addUser(v.room, message.user);
    });
    this.logger.log('Sending message...');

    this.chatService.sendMessage(message).then((v) => {
      this.server.to(v.chatRoomId.toString()).emit('receive', message);
      this.logger.log(
        `Message from ${message.user?.uuid} in room ${message.chatRoomId.toString()} : ${message.content}`,
      );
    });
  }

  async addUser(room: ChatRoomDto, user: UserDto): Promise<ChatRoomDto> {
    room.users.push(user);
    await this.cacheService.set(
      `chat:room:${room.chatRoomId}`,
      JSON.stringify(room),
    );

    return room;
  }

  async getRoom(room: Partial<ChatRoomDto>): Promise<ChatRoomDto> {
    const findRoom = await this.cacheService
      .get(`chat:room:${room.chatRoomId}`)
      .then(async (v) => {
        if (!v) {
          this.logger.debug(`Room ${room.chatRoomId} not found`);

          v = JSON.stringify(room);
          await this.cacheService.set(room.chatRoomId.toString(), v);
        }
        return v;
      });
    return await JSON.parse(findRoom);
  }

  async findRoomInUser(
    client: UserSocket,
    room: Partial<ChatRoomDto>,
  ): Promise<{ room: ChatRoomDto; user?: UserDto }> {
    const currentUser = this.getUser(client);

    return await this.getRoom(room).then((v: ChatRoomDto) => {
      v.users = v.users ?? [];
      const user = v.users.find((user: UserDto) => {
        if (user.uuid === currentUser.uuid) {
          return user;
        }
      });

      return { room: v, user: user };
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
