import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from 'typeorm';
import {PetChecklistEntity} from './pet-checklist.entity';
import {Builder} from 'builder-pattern';
import {PetChecklistChoiceAnswerEntity} from './pet-checklist-chocie-answer.entity';
import {PetChecklistChoice} from '../pet/pet.checklist-choice.domain';

@Entity('pet_checklist_choices')
export class PetChecklistChoiceEntity {
  @PrimaryGeneratedColumn()
  petChecklistChoiceId: number;

  @ManyToOne(
    () => PetChecklistEntity,
    (petChecklist) => petChecklist.petChecklistChoices,
  )
  @JoinColumn({ name: 'pet_checklist_id' })
  petChecklist: PetChecklistEntity;

  @Column('text')
  petChecklistChoiceContent: string;

  @OneToMany(
    () => PetChecklistChoiceAnswerEntity,
    (petChecklistChoiceAnswer) => petChecklistChoiceAnswer.petChecklistChoice,
  )
  petChecklistChoiceAnswers: PetChecklistChoiceAnswerEntity[];

  static create(dto: PetChecklistChoice): PetChecklistChoiceEntity {
    return Builder(PetChecklistChoiceEntity)
      .petChecklistChoiceContent(dto.petChecklistChoiceContent)
      .build();
  }
}
