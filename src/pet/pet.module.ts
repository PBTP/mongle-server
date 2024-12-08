import { Module } from '@nestjs/common';

import {
  PET_CHECKLIST_REPOSITORY,
  PetChecklistRepository,
} from './port/pet.checklist.repository';
import { BREED_REPOSITORY, BreedRepository } from './port/bree.repository';
import {
  PET_CHECKLIST_ANSWER_REPOSITORY,
  PetChecklistAnswerRepository,
} from './port/pet.checklist-answer.repository';
import { PET_CHECKLIST_CHOICE_REPOSITORY } from './port/pet.checklist-choice.repository';
import {
  PET_CHECKLIST_CHOICE_ANSWER_REPOSITORY,
  PetChecklistChoiceAnswerRepository,
} from './port/pet.checklist-choice-answer.repository';
import { PetService } from './application/pet.service';
import { UUID_HOLDER, UUIDHolder } from '../common/holder/uuid.holders';
import { CustomerModule } from '../customer/customer.module';
import { PetController } from './presentation/pet.controller';
import { PET_REPOSITORY, PetRepository } from './port/pet.repository';
import { DATE_HOLDER, DateHolder } from '../common/holder/date.holder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from '../schemas/pets.entity';
import { PetChecklist } from './pet.checklist.domain';
import { PetChecklistEntity } from '../schemas/pet-checklist.entity';
import { PetChecklistAnswerEntity } from '../schemas/pet-checklist-answer.entity';
import { PetChecklistChoiceEntity } from '../schemas/pet-checklist-chocie.entity';
import { PetChecklistChoiceAnswerEntity } from '../schemas/pet-checklist-chocie-answer.entity';
import { BreedEntity } from '../schemas/breed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PetEntity,
      PetChecklistEntity,
      PetChecklistAnswerEntity,
      PetChecklistChoiceEntity,
      PetChecklistChoiceAnswerEntity,
      BreedEntity,
    ]),
    CustomerModule,
  ],
  controllers: [PetController],
  providers: [
    PetService,
    { provide: PET_REPOSITORY, useClass: PetRepository },
    { provide: PET_CHECKLIST_REPOSITORY, useClass: PetChecklistRepository },
    { provide: BREED_REPOSITORY, useClass: BreedRepository },
    {
      provide: PET_CHECKLIST_ANSWER_REPOSITORY,
      useClass: PetChecklistAnswerRepository,
    },
    {
      provide: PET_CHECKLIST_CHOICE_REPOSITORY,
      useClass: PetChecklistChoiceAnswerRepository,
    },
    {
      provide: PET_CHECKLIST_CHOICE_ANSWER_REPOSITORY,
      useClass: PetChecklistChoiceAnswerRepository,
    },
    {
      provide: UUID_HOLDER,
      useClass: UUIDHolder,
    },
    {
      provide: DATE_HOLDER,
      useClass: DateHolder,
    },
  ],
  exports: [PetService],
})
export class PetModule {}
