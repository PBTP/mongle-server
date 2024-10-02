import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { PetChecklist } from "./pet-checklist.entity";
import { Pet } from "./pets.entity";

@Entity('pet_checklist_answers')
export class PetChecklistAnswer {
  @PrimaryColumn()
  petId: number;

  @PrimaryColumn()
  petChecklistId: number;

  @ManyToOne(
    () => Pet,
    (pet) => pet.petChecklistAnswer,
  )
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(
    () => PetChecklist,
    (petChecklist) => petChecklist.petChecklistAnswer,
  )
  @JoinColumn({ name: 'pet_checklist_id' })
  petChecklist: PetChecklist;

  @Column('text')
  petChecklistAnswer: string;
}
