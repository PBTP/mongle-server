import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PetChecklist } from './pet-checklist.entity';
import { Pet } from './pets.entity';

export type TPetChecklistAnswer = {
  petId: number;
  petChecklistId: number;
  pet: Pet;
  petChecklist: PetChecklist;
  petChecklistAnswer: string;
};

@Entity('pet_checklist_answers')
export class PetChecklistAnswer implements TPetChecklistAnswer {
  @PrimaryColumn()
  petId: number;

  @PrimaryColumn()
  petChecklistId: number;

  @ManyToOne(() => Pet, (pet) => pet.petChecklistAnswer)
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(
    () => PetChecklist,
    (petChecklist) => petChecklist.petChecklistAnswers,
  )
  @JoinColumn({ name: 'pet_checklist_id' })
  petChecklist: PetChecklist;

  @Column('text')
  petChecklistAnswer: string;
}
