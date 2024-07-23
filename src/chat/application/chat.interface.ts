import { UserDto } from '../../auth/presentation/user.dto';
import { ChatRoomDto } from '../presentation/chat.dto';

export interface IChatService {
  exitsUserRoom(user: UserDto, chatRoomId: number): Promise<boolean>;
  findChatRooms(user: UserDto): Promise<ChatRoomDto[]>;
  createChatRoom(chatRoomDto: ChatRoomDto): Promise<ChatRoomDto>;
}
