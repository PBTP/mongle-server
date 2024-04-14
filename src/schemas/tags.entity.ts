import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Business_tags } from './business-tags.entity';

@Entity()
export class Tags {
  @PrimaryColumn()
  @ApiProperty({ example: 'tag_id 예시', description: 'tag_id 설명' })
  public tag_id: number;

  @Column()
  @ApiProperty({ example: 'tag_name 예시', description: 'tag_name 설명' })
  public tag_name: string;

  @OneToMany(() => Business_tags, (business_tags) => business_tags.tag)
  public business_tags: Business_tags[];
}
