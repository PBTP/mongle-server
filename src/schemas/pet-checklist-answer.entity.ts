import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { PetChecklist } from "./pet-checklist.entity";
import { PetEntity } from "./pets.entity";

@Entity('pet_checklist_answers')
export class PetChecklistAnswer {
  @PrimaryColumn()
  petId: number;

  @PrimaryColumn()
  petChecklistId: number;

  @ManyToOne(() => PetEntity, (pet) => pet.petChecklistAnswer)
  @JoinColumn({ name: 'pet_id' })
  pet: PetEntity;

  @ManyToOne(
    () => PetChecklist,
    (petChecklist) => petChecklist.petChecklistAnswers,
  )
  @JoinColumn({ name: 'pet_checklist_id' })
  petChecklist: PetChecklist;

  @Column('text')
  petChecklistAnswer: string;
}
