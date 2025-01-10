import { Module } from '@nestjs/common';
import { CustomerChatService } from './application/customer-chat.service';
import { CustomerModule } from '../customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerChatRoom } from '../schemas/customer-chat-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerChatRoom]), CustomerModule],
  controllers: [],
  providers: [CustomerChatService],
  exports: [CustomerChatService],
})
export class CustomerChatModule {}
