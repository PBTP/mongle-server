import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PetChecklistChoiceEntity} from './pet-checklist-chocie.entity';
import {PetChecklistAnswerEntity} from './pet-checklist-answer.entity';
import {PetChecklist} from '../pet/pet.checklist.domain';
import {Builder} from 'builder-pattern';
import {BadRequestException} from '@nestjs/common/exceptions';

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
export class PetChecklistEntity {
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
    () => PetChecklistChoiceEntity,
    (petCheckListChoice) => petCheckListChoice.petChecklist,
  )
  petChecklistChoices: PetChecklistChoiceEntity[];

  @OneToMany(
    () => PetChecklistAnswerEntity,
    (petChecklistAnswer) => petChecklistAnswer.petChecklist,
  )
  petChecklistAnswers: PetChecklistAnswerEntity[];

  public static create(checklist: PetChecklist): PetChecklistEntity {
    if (
      !checklist.petChecklistContent ||
      !checklist.petChecklistCategory ||
      !checklist.petChecklistType
    ) {
      throw new BadRequestException('필수 입력값이 누락되었습니다.');
    }

    return Builder(PetChecklistEntity)
      .petChecklistType(checklist.petChecklistType)
      .petChecklistCategory(checklist.petChecklistCategory)
      .petChecklistContent(checklist.petChecklistContent)
      .build();
  }
}
