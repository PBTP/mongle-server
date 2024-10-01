import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
export enum PetChecklistCategory {
  HEALTH = 'health',
  FOOD = 'food',
  GROOMING = 'grooming',
  PERSONALITY = 'personality',
  OTHER = 'other',
}

export enum ChecklistType {
  CHOICE = 'choice',
  ANSWER = 'answer',
}
@Entity('pet_checklist')
export class PetChecklist {
  @PrimaryGeneratedColumn()
  petChecklistId: number;

  @Column({
    type: 'enum',
    enum: ChecklistType,
  })
  petChecklistType: ChecklistType;

  @Column({
    type: 'enum',
    enum: PetChecklistCategory,
  })
  petChecklistCategory: PetChecklistCategory;

  @Column('text')
  petChecklistTitle: string;
}
