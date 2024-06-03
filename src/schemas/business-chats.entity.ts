import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Business } from './business.entity';
import { BusinessChatMessage } from './business-chat-messages.entity';
import { Customer } from './customers.entity';

@Entity({ name: 'business_chats' })
export class BusinessChat {
  @PrimaryColumn()
  public businessChatId: number;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

  @CreateDateColumn()
  public createdAt: Date;

  @OneToMany(
    () => BusinessChatMessage,
    (businessChatMessages) => businessChatMessages.businessChat,
  )
  public businessChatMessages: BusinessChatMessage[];

  @ManyToOne(() => Business, (business) => business.businessChats)
  @JoinColumn({ name: 'business_id' })
  public business: Business;

  @ManyToOne(() => Customer, (customers) => customers.businessChats)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customer;
}
