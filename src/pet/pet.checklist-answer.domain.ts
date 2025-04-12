import { PetChecklistAnswerEntity } from "@schemas/pet-checklist-answer.entity";
import { Builder } from 'builder-pattern';
import { PetChecklistAnswerDto } from './presentation/pet.dto';
import { BadRequestException } from '@nestjs/common/exceptions';

export class PetChecklistAnswer {
  petId: number;
  petChecklistId: number;
  petChecklistAnswer: string;

  static from(entity: PetChecklistAnswerEntity): PetChecklistAnswer {
    return Builder(PetChecklistAnswer)
      .petId(entity.petId)
      .petChecklistId(entity.petChecklistId)
      .petChecklistAnswer(entity.petChecklistAnswer)
      .build();
  }

  static create(dto: PetChecklistAnswerDto): PetChecklistAnswer {
    if (!dto.petId) {
      throw new BadRequestException('필수 입력값이 누락되었습니다.');
    }

    return Builder(PetChecklistAnswer)
      .petId(dto.petId)
      .petChecklistId(dto.petChecklistId)
      .petChecklistAnswer(dto.petChecklistAnswer)
      .build();
  }
}
