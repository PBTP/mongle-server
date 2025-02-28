import { PetChecklistChoice } from '../../../src/pet/pet.checklist-choice.domain';
import { IPetChecklistChoiceRepository } from '../../../src/pet/port/pet.checklist-choice.repository';
import { PetChecklistChoiceEntity } from '../../../src/schemas/pet-checklist-chocie.entity';

export class FakePetChecklistChoiceRepository
  implements IPetChecklistChoiceRepository
{
  private readonly choices: PetChecklistChoiceEntity[] = [];

  async create(choice: PetChecklistChoice): Promise<PetChecklistChoiceEntity> {
    const newChoice: PetChecklistChoiceEntity =
      PetChecklistChoiceEntity.create(choice);
    newChoice.petChecklistChoiceId = this.choices.length + 1;
    this.choices.push(newChoice);
    return newChoice;
  }
}
