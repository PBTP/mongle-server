import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Images {
  @PrimaryColumn()
  @ApiProperty({ example: 'image_id 예시', description: 'image_id 설명' })
  public image_id: string;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @Column()
  @ApiProperty({ example: 'image_link 예시', description: 'image_link 설명' })
  public image_link: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;
}
