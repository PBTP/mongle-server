import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetService } from './application/pet.service';
import { PetController } from './presentation/pet.controller';
import { Pet } from 'src/schemas/pets.entity';
import { Breed } from 'src/schemas/breed.entity';
import { PetChecklist } from '../schemas/pet-checklist.entity';
import { CustomerModule } from '../customer/customer.module';
import { PetChecklistChoiceAnswer } from '../schemas/pet-checklist-chocie-answer.entity';
import { PetChecklistAnswer } from '../schemas/pet-checklist-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pet,
      Breed,
      PetChecklist,
      PetChecklistAnswer,
      PetChecklistChoiceAnswer,
    ]),
    CustomerModule,
  ],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}
