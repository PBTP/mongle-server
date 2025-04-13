import { Builder } from 'builder-pattern';
import { PetChecklistAnswerEntity } from "@schemas/pet-checklist-answer.entity";
import {
  ChecklistType,
  PetChecklistCategory,
  PetChecklistEntity,
} from "@schemas/pet-checklist.entity";

export class PetChecklist {
  petChecklistId: number;
  petChecklistType: ChecklistType;
  petChecklistCategory: PetChecklistCategory;
  petChecklistContent: string;
  petChecklistAnswers?: PetChecklistAnswerEntity[];

  static from(entity: PetChecklistEntity): PetChecklist {
    return Builder(PetChecklist)
      .petChecklistId(entity.petChecklistId)
      .petChecklistType(entity.petChecklistType)
      .petChecklistCategory(entity.petChecklistCategory)
      .petChecklistContent(entity.petChecklistContent)
      .build();
  }
}
