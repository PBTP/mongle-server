import {Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {PetChecklistChoiceEntity} from './pet-checklist-chocie.entity';
import {PetChecklistChoiceAnswer} from '../pet/pet.checklist-choice-answer.domain';
import {Builder} from 'builder-pattern';
import {BadRequestException} from '@nestjs/common/exceptions';

@Entity('pet_checklist_choices_answers')
export class PetChecklistChoiceAnswerEntity {
  @PrimaryColumn()
  petId: number;

  @PrimaryColumn()
  petChecklistId: number;

  @PrimaryColumn()
  petChecklistChoiceId: number;

  @ManyToOne(
    () => PetChecklistChoiceEntity,
    (petChecklistChoice) => petChecklistChoice.petChecklistChoiceAnswers,
  )
  @JoinColumn({ name: 'pet_checklist_choice_id' })
  petChecklistChoice: PetChecklistChoiceEntity;

  static create(
    choice: PetChecklistChoiceAnswer,
  ): PetChecklistChoiceAnswerEntity {
    return Builder(PetChecklistChoiceAnswerEntity)
      .petId(choice.petId)
      .petChecklistId(choice.petChecklistId)
      .petChecklistChoiceId(choice.petChecklistChoiceId)
      .build();
  }

  static delete(
    choiceAnswer: PetChecklistChoiceAnswer,
  ): PetChecklistChoiceAnswerEntity {
    if (
      !choiceAnswer.petId ||
      !choiceAnswer.petChecklistId ||
      !choiceAnswer.petChecklistChoiceId
    ) {
      throw new BadRequestException('필수 입력값이 누락되었습니다.');
    }

    return Builder(PetChecklistChoiceAnswerEntity)
      .petId(choiceAnswer.petId)
      .petChecklistId(choiceAnswer.petChecklistId)
      .petChecklistChoiceId(choiceAnswer.petChecklistChoiceId)
      .build();
  }
}
