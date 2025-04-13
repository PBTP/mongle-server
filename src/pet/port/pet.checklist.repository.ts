import {
  ChecklistType,
  PetChecklistCategory,
  PetChecklistEntity,
} from "@schemas/pet-checklist.entity";
import { PetChecklist } from '../pet.checklist.domain';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PetChecklistAnswerEntity } from "@schemas/pet-checklist-answer.entity";
import { PetChecklistChoice } from '../pet.checklist-choice.domain';

export const PET_CHECKLIST_REPOSITORY = Symbol('PetChecklistRepository');

export interface IPetChecklistRepository {
  findCheckList(
    category: PetChecklistCategory,
    type: ChecklistType,
    petId: number | null,
  ): Promise<PetChecklistEntity[]>;

  findByIds(ids: number[]): Promise<PetChecklistEntity[]>;
  create(dto: PetChecklist): Promise<PetChecklistEntity>;
}

@Injectable()
export class PetChecklistRepository implements IPetChecklistRepository {
  constructor(
    @InjectRepository(PetChecklistEntity)
    private readonly petChecklistDB: Repository<PetChecklistEntity>,
  ) {}

  async findCheckList(
    category: PetChecklistCategory,
    type: ChecklistType,
    petId: number | null,
  ): Promise<PetChecklistEntity[]> {
    let query = this.petChecklistDB
      .createQueryBuilder('PC')
      .leftJoinAndMapMany(
        'PC.petChecklistChoices',
        PetChecklistChoice,
        'PCC',
        'PC.pet_checklist_id = PCC.pet_checklist_id',
      );

    if (petId) {
      query = query
        .leftJoinAndMapOne(
          'PCC.petChecklistChoiceAnswers',
          PetChecklistChoice,
          'PCCA',
          `PCC.pet_checklist_id = PCCA.pet_checklist_id 
            AND PCC.pet_checklist_choice_id = PCCA.pet_checklist_choice_id 
            AND PCCA.pet_id = :petId`,
          { petId },
        )
        .leftJoinAndMapMany(
          'PC.petChecklistAnswers',
          PetChecklistAnswerEntity,
          'PCA',
          'PC.pet_checklist_id = PCA.pet_checklist_id AND PCA.pet_id = :petId',
          { petId },
        );
    }

    type && query.andWhere('PC.pet_checklist_type = :type', { type });
    category &&
      query.andWhere('PC.pet_checklist_category = :category', { category });

    query.orderBy('PC.pet_checklist_id');

    return await query.getMany();
  }

  async create(dto: PetChecklist): Promise<PetChecklistEntity> {
    const entity = this.petChecklistDB.create(PetChecklistEntity.create(dto));
    return await this.petChecklistDB.save(entity);
  }

  async findByIds(ids: number[]): Promise<PetChecklistEntity[]> {
    return await this.petChecklistDB.find({
      where: {
        petChecklistId: In(ids),
      },
    });
  }
}
