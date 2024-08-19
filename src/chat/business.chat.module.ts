import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessChatService } from './application/business-chat.service';
import { BusinessChatRoom } from '../schemas/business-chat-room.entity';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessChatRoom]), BusinessModule],
  controllers: [],
  providers: [BusinessChatService],
  exports: [BusinessChatService],
})
export class BusinessChatModule {}
