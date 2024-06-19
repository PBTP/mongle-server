import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('sms_verifications')
export class PhoneVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phoneNumber: string;

  @Column()
  verificationCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiredAt: Date;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ type: 'uuid', unique: true, nullable: true })
  verificationId: string;
}
