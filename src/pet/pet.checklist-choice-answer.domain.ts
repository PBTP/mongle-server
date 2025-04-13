import { Builder } from 'builder-pattern';
import { BadRequestException } from '@nestjs/common/exceptions';
import { PetChecklistChoiceAnswerEntity } from "@schemas/pet-checklist-chocie-answer.entity";
import { PetChecklistChoiceAnswerDto } from './presentation/pet.dto';

export class PetChecklistChoiceAnswer {
  petId: number;
  petChecklistId: number;
  petChecklistChoiceId: number;

  static from(
    entity: PetChecklistChoiceAnswerEntity,
  ): PetChecklistChoiceAnswer {
    return Builder(PetChecklistChoiceAnswer)
      .petId(entity.petId)
      .petChecklistId(entity.petChecklistId)
      .petChecklistChoiceId(entity.petChecklistChoiceId)
      .build();
  }

  static create(dto: PetChecklistChoiceAnswerDto): PetChecklistChoiceAnswer {
    if (dto.petId || !dto.petChecklistChoiceId) {
      throw new BadRequestException('필수 입력값이 누락되었습니다.');
    }

    return Builder(PetChecklistChoiceAnswer)
      .petId(dto.petId)
      .petChecklistChoiceId(dto.petChecklistChoiceId)
      .petChecklistChoiceId(dto.petChecklistChoiceId)
      .build();
  }
}
