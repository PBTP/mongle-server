import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PetChecklistChoice } from "./pet-checklist-chocie.entity";
import { PetChecklistAnswer } from "./pet-checklist-answer.entity";

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
  petChecklistContent: string;

  @OneToMany(
    () => PetChecklistChoice,
    (petCheckListChoice) => petCheckListChoice.petChecklist,
  )
  petChecklistChoices: PetChecklistChoice[];

  @OneToMany(
    () => PetChecklistAnswer,
    (petChecklistAnswer) => petChecklistAnswer.petChecklist,
  )
  petChecklistAnswer: PetChecklistAnswer[];
}
