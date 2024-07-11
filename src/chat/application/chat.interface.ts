import { ChatRoomDto } from '../presentation/chat-room.dto';

export interface IChatService {
  createChatRoom(chatRoomDto: ChatRoomDto): any;
}
