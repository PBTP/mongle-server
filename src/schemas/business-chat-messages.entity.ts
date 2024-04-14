import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Business_chats } from './business-chats.entity';

@Entity()
export class Business_chat_messages {
  @PrimaryColumn()
  @ApiProperty({
    example: 'business_chat_message_id 예시',
    description: 'business_chat_message_id 설명',
  })
  public business_chat_message_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'sender_uuid 예시', description: 'sender_uuid 설명' })
  public sender_uuid: string;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @Column()
  @ApiProperty({
    example: 'business_chat_message_type 예시',
    description: 'business_chat_message_type 설명',
  })
  public business_chat_message_type: string;

  @Column()
  @ApiProperty({
    example: 'business_chat_message_content 예시',
    description: 'business_chat_message_content 설명',
  })
  public business_chat_message_content: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @ManyToOne(
    () => Business_chats,
    (business_chats) => business_chats.business_chat_messages,
  )
  @JoinColumn({ name: 'business_chat_id' })
  public business_chat: Business_chats;
}
