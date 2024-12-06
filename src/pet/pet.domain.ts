import { Entity } from 'typeorm';
import { Review } from '../schemas/reviews.entity';
import { Appointment } from '../schemas/appointments.entity';
import { CustomerEntity } from '../schemas/customer.entity';
import { Breed } from '../schemas/breed.entity';
import { PetChecklistAnswer } from '../schemas/pet-checklist-answer.entity';
import { Builder } from 'builder-pattern';
import { PetEntity } from '../schemas/pets.entity';

@Entity({ name: 'pets' })
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
  breed: Breed;
  petChecklistAnswer: PetChecklistAnswer;

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
}
