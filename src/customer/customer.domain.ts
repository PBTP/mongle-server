import { Point } from 'typeorm';
import { AuthProvider } from '../auth/presentation/user.dto';
import { Favorite } from '../schemas/favorites.entity';
import { Review } from '../schemas/reviews.entity';
import { Appointment } from '../schemas/appointments.entity';
import { Pet } from '../schemas/pets.entity';
import { CustomerChatRoom } from '../schemas/customer-chat-room.entity';
import { AuthDto } from '../auth/presentation/auth.dto';

export type Customer = AuthDto &{
  customerId: number;
  customerName: string;
  customerPhoneNumber?: string;
  customerAddress?: string;
  customerDetailAddress?: string;
  customerLocation?: Point;
  authProvider: AuthProvider;
  refreshToken?: string;
  favorites: Favorite[];
  reviews: Review[];
  appointments: Appointment[];
  pets: Pet[];
  chatRooms: CustomerChatRoom[];
}
