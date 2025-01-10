import { Module } from '@nestjs/common';
import { ChatGateway } from './presentation/chat.gateway';
import { ChatController } from './presentation/chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from '../schemas/chat-room.entity';
import { ChatMessage } from '../schemas/chat-message.entity';
import { ChatService } from './application/chat.service';
import { CacheModule } from '../common/cache/cache.module';
import { CustomerChatModule } from './customer.chat.module';
import { DriverChatModule } from './driver.chat.module';
import { BusinessChatModule } from './business.chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, ChatMessage]),
    CacheModule,
    DriverChatModule,
    CustomerChatModule,
    BusinessChatModule,
  ],
  exports: [ChatService],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
