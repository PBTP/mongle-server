import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetService } from './application/pet.service';
import { PetController } from './presentation/pet.controller';
import { Pet } from 'src/schemas/pets.entity';
import { Breed } from 'src/schemas/breed.entity';
import { PetChecklist } from '../schemas/pet-checklist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, Breed, PetChecklist])],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}
