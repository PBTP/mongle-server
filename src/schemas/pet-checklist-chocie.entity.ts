import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PetChecklist } from './pet-checklist.entity';
import { PetChecklistChoiceAnswer } from './pet-checklist-chocie-answer.entity';

export type TPetChecklistChoice = {
  petChecklistChoiceId: number;
  petChecklist: PetChecklist;
  petChecklistChoiceContent: string;
  petChecklistChoiceAnswers: PetChecklistChoiceAnswer[];
};

@Entity('pet_checklist_choices')
export class PetChecklistChoice implements TPetChecklistChoice {
  @PrimaryGeneratedColumn()
  petChecklistChoiceId: number;

  @ManyToOne(
    () => PetChecklist,
    (petChecklist) => petChecklist.petChecklistChoices,
  )
  @JoinColumn({ name: 'pet_checklist_id' })
  petChecklist: PetChecklist;

  @Column('text')
  petChecklistChoiceContent: string;

  @OneToMany(
    () => PetChecklistChoiceAnswer,
    (petChecklistChoiceAnswer) => petChecklistChoiceAnswer.petChecklistChoice,
  )
  petChecklistChoiceAnswers: PetChecklistChoiceAnswer[];
}
