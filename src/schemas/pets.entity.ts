import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Appointment} from './appointments.entity';
import {BreedEntity} from './breed.entity';
import {CustomerEntity} from './customer.entity';
import {Review} from './reviews.entity';
import {HasUuid} from '../common/entity/parent.entity';
import {PetChecklistAnswerEntity} from './pet-checklist-answer.entity';
import {Builder} from 'builder-pattern';
import {Pet} from '../pet/pet.domain';
import {DateHolder} from '../common/holder/date.holder';
import {UUIDHolder} from '../common/holder/uuid.holders';
import {BadRequestException} from '@nestjs/common/exceptions';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity({ name: 'pets' })
export class PetEntity extends HasUuid {
  @PrimaryColumn()
  public petId: number;

  @Column()
  public petName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  public petGender: string;

  @Column({
    type: 'date',
  })
  public petBirthdate: Date;

  @Column({
    type: 'double precision',
  })
  public petWeight: number;

  @Column()
  public neuteredYn: boolean;

  @Column()
  public personality: string;

  @Column()
  public vaccinationStatus: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public modifiedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  @OneToMany(() => Review, (reviews) => reviews.pet)
  public reviews: Review[];

  @OneToMany(() => Appointment, (appointments) => appointments.pet)
  public appointments: Appointment[];

  @ManyToOne(() => CustomerEntity, (customers) => customers.pets)
  @JoinColumn({ name: 'customer_id' })
  public customer: CustomerEntity;

  @ManyToOne(() => BreedEntity, (breed) => breed.pets)
  @JoinColumn({ name: 'breed_id' })
  public breed: BreedEntity;

  @ManyToOne(
    () => PetChecklistAnswerEntity,
    (petChecklistAnswer) => petChecklistAnswer.pet,
  )
  @JoinColumn({ name: 'pet_id' })
  petChecklistAnswer: PetChecklistAnswerEntity;

  static from(pet: Pet): PetEntity {
    return Builder(PetEntity)
      .uuid(pet.uuid)
      .petId(pet.petId)
      .petName(pet.petName)
      .petGender(pet.petGender)
      .petBirthdate(pet.petBirthdate)
      .petWeight(pet.petWeight)
      .neuteredYn(pet.neuteredYn)
      .personality(pet.personality)
      .vaccinationStatus(pet.vaccinationStatus)
      .reviews(pet.reviews)
      .appointments(pet.appointments)
      .breed(pet.breed)
      .build();
  }

  static create(
    pet: Pet,
    customer: CustomerEntity,
    uuid: UUIDHolder,
    dateHolder: DateHolder,
  ): PetEntity {
    if (
      pet.petName === undefined ||
      pet.petGender === undefined ||
      pet.petBirthdate === undefined ||
      pet.petWeight === undefined ||
      pet.neuteredYn === undefined ||
      pet.personality === undefined ||
      pet.vaccinationStatus === undefined ||
      pet.appointments === undefined ||
      pet.breed === undefined
    ) {
      throw new BadRequestException('필수 정보가 누락되었습니다.');
    }

    return Builder(PetEntity)
      .uuid(uuid.generatedUuid())
      .petName(pet.petName)
      .petGender(pet.petGender)
      .petBirthdate(pet.petBirthdate)
      .petWeight(pet.petWeight)
      .neuteredYn(pet.neuteredYn)
      .personality(pet.personality)
      .vaccinationStatus(pet.vaccinationStatus)
      .createdAt(dateHolder.now())
      .modifiedAt(dateHolder.now())
      .reviews(pet.reviews)
      .appointments(pet.appointments)
      .customer(customer)
      .breed(pet.breed)
      .build();
  }

  static update(pet: Pet, dateHolder: DateHolder): PetEntity {
    return Builder(PetEntity)
      .petId(pet.petId)
      .petName(pet.petName)
      .petGender(pet.petGender)
      .petBirthdate(pet.petBirthdate)
      .petWeight(pet.petWeight)
      .neuteredYn(pet.neuteredYn)
      .personality(pet.personality)
      .vaccinationStatus(pet.vaccinationStatus)
      .modifiedAt(dateHolder.now())
      .breed(pet.breed)
      .build();
  }

  static delete(pet: Pet, dateHolder: DateHolder): PetEntity {
    return Builder(PetEntity)
      .petId(pet.petId)
      .deletedAt(dateHolder.now())
      .build();
  }
}
