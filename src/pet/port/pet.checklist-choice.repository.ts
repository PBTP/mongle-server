import { PetChecklistChoice } from '../pet.checklist-choice.domain';
import { PetChecklistChoiceEntity } from "@schemas/pet-checklist-chocie.entity";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export const PET_CHECKLIST_CHOICE_REPOSITORY = Symbol(
  'PetChecklistChoiceRepository',
);

export interface IPetChecklistChoiceRepository {
  create(dto: PetChecklistChoice): Promise<PetChecklistChoiceEntity>;
}

export class PetChecklistChoiceRepository
  implements IPetChecklistChoiceRepository
{
  constructor(
    @InjectRepository(PetChecklistChoiceEntity)
    private readonly petChecklistChoiceDB: Repository<PetChecklistChoiceEntity>,
  ) {}

  async create(choice: PetChecklistChoice): Promise<PetChecklistChoiceEntity> {
    return await this.petChecklistChoiceDB.save(
      this.petChecklistChoiceDB.create(PetChecklistChoiceEntity.create(choice)),
    );
  }
}
