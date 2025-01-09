import {PetChecklistAnswerEntity} from '../../schemas/pet-checklist-answer.entity';
import {PetChecklistAnswer} from '../pet.checklist-answer.domain';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

export const PET_CHECKLIST_ANSWER_REPOSITORY = Symbol(
  'PetChecklistAnswerRepository',
);

export interface IPetChecklistAnswerRepository {
  create(dto: PetChecklistAnswer): Promise<PetChecklistAnswerEntity>;
}

export class PetChecklistAnswerRepository
  implements IPetChecklistAnswerRepository
{
  constructor(
    @InjectRepository(PetChecklistAnswerEntity)
    private readonly petChecklistAnswerDB: Repository<PetChecklistAnswerEntity>,
  ) {}

  async create(dto: PetChecklistAnswer): Promise<PetChecklistAnswerEntity> {
    return await this.petChecklistAnswerDB.save(
      this.petChecklistAnswerDB.create(PetChecklistAnswerEntity.create(dto)),
    );
  }
}
