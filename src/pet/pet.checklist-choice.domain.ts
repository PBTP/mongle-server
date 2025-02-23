import { Builder } from 'builder-pattern';
import { PetChecklistChoiceDto } from './presentation/pet.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { PetChecklistChoiceEntity } from '../schemas/pet-checklist-chocie.entity';

export class PetChecklistChoice {
  petChecklistChoiceId: number;
  petChecklistChoiceContent: string;

  static from(entity: PetChecklistChoiceEntity): PetChecklistChoice {
    return Builder(PetChecklistChoice)
      .petChecklistChoiceId(entity.petChecklistChoiceId)
      .petChecklistChoiceContent(entity.petChecklistChoiceContent)
      .build();
  }

  static create(dto: PetChecklistChoiceDto): PetChecklistChoice {
    if (!dto.petChecklistChoiceId) {
      throw new BadRequestException('필수 입력값이 누락되었습니다.');
    }

    return Builder(PetChecklistChoice)
      .petChecklistChoiceId(dto.petChecklistChoiceId)
      .petChecklistChoiceContent(dto.petChecklistChoiceContent)
      .build();
  }
}
