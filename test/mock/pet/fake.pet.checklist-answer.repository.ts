import { PetChecklistAnswer } from "@pet/pet.checklist-answer.domain";
import { IPetChecklistAnswerRepository } from "@pet/port/pet.checklist-answer.repository";
import { PetChecklistAnswerEntity } from "@schemas/pet-checklist-answer.entity";

export class FakePetChecklistAnswerRepository
  implements IPetChecklistAnswerRepository
{
  private readonly answers: PetChecklistAnswerEntity[] = [];

  async create(dto: PetChecklistAnswer): Promise<PetChecklistAnswerEntity> {
    // 1) PetChecklistAnswerEntity - create) DTO 기반으로 객체 생성 (유효성 검사 및 객체 생성)
    // 2) TypeORM - create) TypeORM에서 사용하는 형식의 엔티티로 변환
    // 3) TypeORM - save) DB에 엔티티 저장
    const newAnswer: PetChecklistAnswerEntity =
      PetChecklistAnswerEntity.create(dto);
    newAnswer.petChecklistAnswerId = this.answers.length + 1;
    this.answers.push(newAnswer);
    return newAnswer;
  }
}
