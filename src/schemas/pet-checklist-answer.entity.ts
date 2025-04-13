import { BadRequestException } from '@nestjs/common/exceptions';
import { Builder } from 'builder-pattern';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PetChecklistAnswer } from "@pet/pet.checklist-answer.domain";
import { PetChecklistEntity } from './pet-checklist.entity';
import { PetEntity } from './pets.entity';

@Entity('pet_checklist_answers')
export class PetChecklistAnswerEntity {
  @PrimaryGeneratedColumn()
  petChecklistAnswerId: number;

  @PrimaryColumn()
  petId: number;

  @PrimaryColumn()
  petChecklistId: number;

  @ManyToOne(() => PetEntity, (pet) => pet.petChecklistAnswer)
  @JoinColumn({ name: 'pet_id' })
  pet: PetEntity;

  @ManyToOne(
    () => PetChecklistEntity,
    (petChecklist) => petChecklist.petChecklistAnswers,
  )
  @JoinColumn({ name: 'pet_checklist_id' })
  petChecklist: PetChecklistEntity;

  @Column('text')
  petChecklistAnswer: string;

  static create(
    petChceklistAnswer: PetChecklistAnswer,
  ): PetChecklistAnswerEntity {
    if (!petChceklistAnswer.petId || !petChceklistAnswer.petChecklistId) {
      throw new BadRequestException('필수 입력값이 누락되었습니다.');
    }

    return Builder(PetChecklistAnswerEntity)
      .petId(petChceklistAnswer.petId)
      .petChecklistId(petChceklistAnswer.petChecklistId)
      .petChecklistAnswer(petChceklistAnswer.petChecklistAnswer)
      .build();
  }
}
