import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Business } from './business.entity';
import { Business_chat_messages } from './business-chat-messages.entity';
import { Customers } from './customers.entity';

@Entity()
export class Business_chats {
  @PrimaryColumn()
  @ApiProperty({
    example: 'business_chat_id 예시',
    description: 'business_chat_id 설명',
  })
  public business_chat_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @OneToMany(
    () => Business_chat_messages,
    (business_chat_messages) => business_chat_messages.business_chat,
  )
  public business_chat_messages: Business_chat_messages[];

  @ManyToOne(() => Business, (business) => business.business_chats)
  @JoinColumn({ name: 'business_id' })
  public business: Business;

  @ManyToOne(() => Customers, (customers) => customers.business_chats)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customers;
}
