import { Point } from 'typeorm';
import { AuthProvider } from '../auth/presentation/user.dto';
import { Favorite } from '../schemas/favorites.entity';
import { Review } from '../schemas/reviews.entity';
import { Appointment } from '../schemas/appointments.entity';
import { Pet } from '../schemas/pets.entity';
import { CustomerChatRoom } from '../schemas/customer-chat-room.entity';
import { AuthDto } from '../auth/presentation/auth.dto';
import { CustomerDto } from './presentation/customer.dto';
import { Builder } from 'builder-pattern';
import { IUUIDHolder } from '../common/holder/uuid.holders';
import { IDateHolder } from '../common/holder/date.holder';
import { PresignedUrlDto } from '../common/cloud/aws/s3/presentation/presigned-url.dto';
import { ImageDto } from '../common/image/presentation/image.dto';

export interface ICustomer extends AuthDto {
  customerId?: number;
  customerName: string;
  customerPhoneNumber?: string;
  customerAddress?: string;
  customerDetailAddress?: string;
  customerLocation?: Point;
  authProvider: AuthProvider;
  refreshToken?: string;
  favorites?: Favorite[];
  reviews?: Review[];
  appointments?: Appointment[];
  pets?: Pet[];
  chatRooms?: CustomerChatRoom[];
  createdAt?: Date;
  modifiedAt?: Date;
  deletedAt?: Date;
}

export class Customer implements ICustomer {
  uuid?: string;
  customerId?: number;
  customerName: string;
  customerPhoneNumber?: string;
  customerAddress?: string;
  customerDetailAddress?: string;
  customerLocation?: Point;
  authProvider: AuthProvider;
  refreshToken?: string;
  favorites?: Favorite[];
  reviews?: Review[];
  appointments?: Appointment[];
  pets?: Pet[];
  chatRooms?: CustomerChatRoom[];
  createdAt?: Date;
  modifiedAt?: Date;
  deletedAt?: Date;
  presignedUrlDto?: PresignedUrlDto;
  profileImage?: ImageDto;

  static from(
    customer: CustomerDto,
    uuidHolder: IUUIDHolder,
    dateHolder: IDateHolder,
  ): Customer {
    if (!customer.customerName || !customer.authProvider) {
      throw new Error('필수 정보가 누락되었습니다.');
    }

    return Builder<Customer>()
      .uuid(uuidHolder.generatedUuid())
      .customerName(customer.customerName)
      .authProvider(customer.authProvider)
      .createdAt(dateHolder.now())
      .modifiedAt(dateHolder.now())
      .build();
  }

  static update(customer: CustomerDto, dateHolder: IDateHolder): Customer {
    return Builder<Customer>()
      .customerName(customer.customerName)
      .customerPhoneNumber(customer.customerPhoneNumber)
      .customerAddress(customer.customerAddress)
      .customerDetailAddress(customer.customerDetailAddress)
      .modifiedAt(dateHolder.now())
      .presignedUrlDto(customer.presignedUrlDto)
      .build();
  }
}
