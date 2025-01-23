import { PetChecklist } from '../../../src/pet/pet.checklist.domain';
import { IPetChecklistRepository } from '../../../src/pet/port/pet.checklist.repository';
import {
  ChecklistType,
  PetChecklistCategory,
  PetChecklistEntity,
} from '../../../src/schemas/pet-checklist.entity';

export class FakePetChecklistRepository implements IPetChecklistRepository {
  private readonly checkLists: PetChecklistEntity[] = [];

  async findCheckList(
    category: PetChecklistCategory,
    type: ChecklistType,
    petId: number | null,
  ): Promise<PetChecklistEntity[]> {
    return this.checkLists.filter((checklist) => {
      const matchesType = !type || checklist.petChecklistType === type;
      const matchesCategory =
        !category || checklist.petChecklistCategory === category;
      const matchesPetId =
        !petId ||
        checklist.petChecklistAnswers?.some((answer) => answer.petId === petId);
      return matchesCategory && matchesType && matchesPetId;
    });
  }

  async findByIds(ids: number[]): Promise<PetChecklistEntity[]> {
    const findCheckList: PetChecklistEntity[] = this.checkLists.filter(
      (cl: PetChecklistEntity) => {
        return ids.includes(cl.petChecklistId);
      },
    );
    if (findCheckList.length === 0) {
      throw new Error('PetChecklistEntity 목록을 찾을 수 없습니다.');
    }
    console.log('findCheckList: ' + findCheckList.length);
    return findCheckList;
  }

  async create(checklist: PetChecklist): Promise<PetChecklistEntity> {
    const entity = PetChecklistEntity.create(checklist);
    entity.petChecklistId = this.checkLists.length + 1;
    this.checkLists.push(entity);
    return entity;
  }

  // 테스트용
  async update(id: number, dto: Partial<PetChecklistEntity>): Promise<void> {
    const index = this.checkLists.findIndex(
      (checkLists) => checkLists.petChecklistId === id,
    );
    if (index !== -1) {
      this.checkLists[index] = {
        ...this.checkLists[index],
        ...dto,
      };
    }
  }
}
