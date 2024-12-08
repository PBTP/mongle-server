import { Review } from '../schemas/reviews.entity';
import { Appointment } from '../schemas/appointments.entity';
import { CustomerEntity } from '../schemas/customer.entity';
import { BreedEntity } from '../schemas/breed.entity';
import { PetChecklistAnswerEntity } from '../schemas/pet-checklist-answer.entity';
import { Builder } from 'builder-pattern';
import { PetEntity } from '../schemas/pets.entity';
import { PetDto } from './presentation/pet.dto';
import { Customer } from '../customer/customer.domain';
import { UUIDHolder } from '../common/holder/uuid.holders';
import { DateHolder } from '../common/holder/date.holder';
import { BadRequestException } from '@nestjs/common/exceptions';

export class Pet {
  uuid: string;
  petId: number;
  petName: string;
  petGender: string;
  petBirthdate: Date;
  petWeight: number;
  neuteredYn: boolean;
  personality: string;
  vaccinationStatus: string;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date;
  reviews: Review[];
  appointments: Appointment[];
  customer: CustomerEntity;
  breed: BreedEntity;
  petChecklistAnswer: PetChecklistAnswerEntity;

  static from(entity: PetEntity): Pet {
    return Builder(Pet)
      .petId(entity.petId)
      .petName(entity.petName)
      .petGender(entity.petGender)
      .petBirthdate(entity.petBirthdate)
      .petWeight(entity.petWeight)
      .neuteredYn(entity.neuteredYn)
      .personality(entity.personality)
      .vaccinationStatus(entity.vaccinationStatus)
      .createdAt(entity.createdAt)
      .modifiedAt(entity.modifiedAt)
      .deletedAt(entity.deletedAt)
      .reviews(entity.reviews)
      .appointments(entity.appointments)
      .customer(entity.customer)
      .breed(entity.breed)
      .petChecklistAnswer(entity.petChecklistAnswer)
      .build();
  }

  static create(
    dto: PetDto,
    breed: BreedEntity,
    customer: Customer,
    uuidHolder: UUIDHolder,
    dateHolder: DateHolder,
  ): Pet {
    if (!dto.petName || !dto.petGender || !dto.petBirthdate || !dto.petWeight || !dto.neuteredYn || !dto.personality || !dto.vaccinationStatus) {
      throw new BadRequestException('필수 입력값이 누락되었습니다.');
    }

    return Builder(Pet)
      .uuid(uuidHolder.generatedUuid())
      .petName(dto.petName)
      .petGender(dto.petGender)
      .petBirthdate(dto.petBirthdate)
      .petWeight(dto.petWeight)
      .neuteredYn(dto.neuteredYn)
      .personality(dto.personality)
      .vaccinationStatus(dto.vaccinationStatus)
      .breed(breed)
      .customer(CustomerEntity.from(customer))
      .createdAt(dateHolder.now())
      .modifiedAt(dateHolder.now())
      .build();
  }
}
