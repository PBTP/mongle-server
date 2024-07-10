import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatDto, MessageDto } from './chat.dto';
import { AuthService } from '../../auth/application/auth.service';
import { CustomerDto } from '../../customer/presentation/customer.dto';

@WebSocketGateway(5000, { namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(ChatGateway.name);

  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    try {
      const customer = await this.authService.getCustomer(
        client.handshake.headers.authorization.replace('Bearer ', ''),
      );

      client['user'] = {
        uuid: customer.uuid,
        name: customer.customerName,
      };
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() chat: ChatDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = client['user'] as CustomerDto;

    if (!client.rooms.has(chat.roomId)) {
      await client.join(chat.roomId);
      this.logger.log(`Client ${user.uuid} joined room ${chat.roomId}`);
      return;
    }
    this.logger.log(`Client ${user.uuid} is already in room ${chat.roomId}`);
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @MessageBody() chat: ChatDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = client['user'] as CustomerDto;

    await client.leave(chat.roomId);
    this.logger.log(`Client ${user.uuid} leave room ${chat.roomId}`);
  }

  @SubscribeMessage('send')
  handleMessage(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() client: Socket,
  ): void {
    message.user = client['user'];

    this.server.to(message.roomId).emit('receive', message);
    this.logger.log(
      `Message from ${message.user} in room ${message.roomId} : ${message.message}`,
    );
  }
}
