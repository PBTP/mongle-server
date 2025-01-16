import { Column } from 'typeorm';
import { HasUuid } from './parent.entity';
import { AuthProvider } from '../../auth/presentation/user.dto';

export abstract class UserEntity extends HasUuid {
  @Column({
    type: 'enum',
    enum: AuthProvider,
    enumName: 'auth_provider',
    nullable: false,
  })
  authProvider: AuthProvider;
}
