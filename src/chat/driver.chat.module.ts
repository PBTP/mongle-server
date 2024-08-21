import { Module } from '@nestjs/common';
import { DriverChatRoom } from '../schemas/driver-chat-room.entity';
import { DriverModule } from '../driver/driver.module';
import { DriverChatService } from './application/driver-chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DriverChatRoom]), DriverModule],
  controllers: [],
  providers: [DriverChatService],
  exports: [DriverChatService],
})
export class DriverChatModule {}
