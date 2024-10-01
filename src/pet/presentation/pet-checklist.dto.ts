import {
  ChecklistType,
  PetChecklistCategory,
} from '../../schemas/pet-checklist.entity';

export class PetChecklistDto {
  petChecklistId: number;
  petChecklistType: ChecklistType;
  petChecklistCategory: PetChecklistCategory;
  petChecklistTitle: string;
}
