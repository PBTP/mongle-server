import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Appointments } from './appointments.entity';
import { Breed } from './breed.entity';
import { Customers } from './customers.entity';
import { Reviews } from './reviews.entity';
import { Gender } from 'src/domain/pet/enums/gender.enum';

@Entity()
export class Pets {
  @PrimaryColumn()
  @ApiProperty({ example: 'pet_id 예시', description: 'pet_id 설명' })
  public pet_id: number;

  @Column({ unique: true, type: 'uuid' })
  @ApiProperty({ example: 'uuid 예시', description: 'uuid 설명' })
  public uuid: string;

  @Column()
  @ApiProperty({ example: 'name 예시', description: 'name 설명' })
  public name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  @ApiProperty({ example: 'gender 예시', description: 'gender 설명' })
  public gender: string;

  @Column({ type: 'date' })
  @ApiProperty({ example: 'birthdate 예시', description: 'birthdate 설명' })
  public birthdate: Date;

  @Column()
  @ApiProperty({ example: 'weight 예시', description: 'weight 설명' })
  public weight: string;

  @Column()
  @ApiProperty({ example: 'neutered_yn 예시', description: 'neutered_yn 설명' })
  public neutered_yn: boolean;

  @Column()
  @ApiProperty({ example: 'personality 예시', description: 'personality 설명' })
  public personality: string;

  @Column()
  @ApiProperty({
    example: 'vaccination_status 예시',
    description: 'vaccination_status 설명',
  })
  public vaccination_status: string;

  @CreateDateColumn()
  @ApiProperty({ example: 'created_at 예시', description: 'created_at 설명' })
  public created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: 'modified_at 예시', description: 'modified_at 설명' })
  public modified_at: Date;

  @DeleteDateColumn()
  @ApiProperty({ example: 'deleted_at 예시', description: 'deleted_at 설명' })
  public deleted_at: Date;

  @OneToMany(() => Reviews, (reviews) => reviews.pet)
  public reviews: Reviews[];

  @OneToMany(() => Appointments, (appointments) => appointments.pet)
  public appointments: Appointments[];

  @ManyToOne(() => Customers, (customers) => customers.pets)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customers;

  @ManyToOne(() => Breed, (breed) => breed.pets)
  @JoinColumn({ name: 'breed_id' })
  public breed: Breed;
}
