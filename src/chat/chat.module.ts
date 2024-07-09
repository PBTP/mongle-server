import { Module } from '@nestjs/common';
import { ChatGateway } from './presentation/chat.gateway';

@Module({
  imports: [],
  providers: [ChatGateway],
})
export class ChatModule {}
