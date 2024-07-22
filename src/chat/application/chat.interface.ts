import { ChatRoomDto } from '../presentation/chat-room.dto';
import { UserDto } from '../../auth/presentation/user.dto';

export interface IChatService {
  findChatRooms(user: UserDto): Promise<ChatRoomDto[]>;
  createChatRoom(chatRoomDto: ChatRoomDto): any;
}
