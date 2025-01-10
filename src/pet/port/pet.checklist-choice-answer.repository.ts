import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PetChecklistChoiceAnswerEntity } from '../../schemas/pet-checklist-chocie-answer.entity';
import { PetChecklistChoiceAnswer } from '../pet.checklist-choice-answer.domain';

export const PET_CHECKLIST_CHOICE_ANSWER_REPOSITORY = Symbol(
  'PetChecklistChoiceAnswerRepository',
);

export interface IPetChecklistChoiceAnswerRepository {
  create(
    choiceAnswer: PetChecklistChoiceAnswer,
  ): Promise<PetChecklistChoiceAnswerEntity>;
  delete(
    param: PetChecklistChoiceAnswer,
  ): Promise<PetChecklistChoiceAnswerEntity>;
}

export class PetChecklistChoiceAnswerRepository
  implements IPetChecklistChoiceAnswerRepository
{
  constructor(
    @InjectRepository(PetChecklistChoiceAnswerEntity)
    private readonly petChecklistChoiceDB: Repository<PetChecklistChoiceAnswerEntity>,
  ) {}

  async create(
    choiceAnswer: PetChecklistChoiceAnswer,
  ): Promise<PetChecklistChoiceAnswerEntity> {
    return await this.petChecklistChoiceDB.save(
      this.petChecklistChoiceDB.create(
        PetChecklistChoiceAnswerEntity.create(choiceAnswer),
      ),
    );
  }

  async delete(
    choiceAnswer: PetChecklistChoiceAnswer,
  ): Promise<PetChecklistChoiceAnswerEntity> {
    const entity = PetChecklistChoiceAnswerEntity.delete(choiceAnswer);
    await this.petChecklistChoiceDB.delete(entity);

    return entity;
  }
}
