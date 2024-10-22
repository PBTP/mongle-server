import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PetChecklistChoice } from './pet-checklist-chocie.entity';

export type TPetChecklistChoiceAnswer = {
  petId: number;
  petChecklistId: number;
  petChecklistChoiceId: number;
  petChecklistChoice: PetChecklistChoice;
};

@Entity('pet_checklist_choices_answers')
export class PetChecklistChoiceAnswer implements TPetChecklistChoiceAnswer {
  @PrimaryColumn()
  petId: number;

  @PrimaryColumn()
  petChecklistId: number;

  @PrimaryColumn()
  petChecklistChoiceId: number;

  @ManyToOne(
    () => PetChecklistChoice,
    (petChecklistChoice) => petChecklistChoice.petChecklistChoiceAnswers,
  )
  @JoinColumn({ name: 'pet_checklist_choice_id' })
  petChecklistChoice: PetChecklistChoice;
}
