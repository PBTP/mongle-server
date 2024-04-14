import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Pets } from './pets.entity';

@Entity()
export class Breed {
  @PrimaryColumn()
  @ApiProperty({ example: 'bree_id 예시', description: 'bree_id 설명' })
  public bree_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @Column()
  @ApiProperty({ example: 'breed_name 예시', description: 'breed_name 설명' })
  public breed_name: string;

  @Column()
  @ApiProperty({
    example: 'breed_description 예시',
    description: 'breed_description 설명',
  })
  public breed_description: string;

  @OneToMany(() => Pets, (pets) => pets.breed)
  public pets: Pets[];
}
