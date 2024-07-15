import { Module } from '@nestjs/common';
import { ChatGateway } from './presentation/chat.gateway';
import { ChatController } from './presentation/chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from '../schemas/chat-rooms.entity';
import { ChatMessage } from '../schemas/chat-message.entity';
import { CustomerChatRoom } from '../schemas/customer-chat-room.entity';
import { DriverChatRoom } from '../schemas/driver-chat-room.entity';
import { BusinessChatRoom } from '../schemas/business-chat-room.entity';
import { ChatService } from './application/chat.service';
import { CustomerChatService } from './application/customer-chat.service';
import { DriverChatService } from './application/driver-chat.service';
import { BusinessChatService } from './application/business-chat.service';
import { CacheModule } from '../common/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom,
      ChatMessage,
      CustomerChatRoom,
      DriverChatRoom,
      BusinessChatRoom,
    ]),
    CacheModule,
  ],
  exports: [
    ChatService,
    CustomerChatService,
    DriverChatService,
    BusinessChatService,
  ],
  providers: [
    ChatService,
    CustomerChatService,
    DriverChatService,
    BusinessChatService,
    ChatGateway,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
