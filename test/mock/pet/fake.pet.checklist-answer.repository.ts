import {IPetChecklistAnswerRepository} from "../../../src/pet/port/pet.checklist-answer.repository";
import {PetChecklistAnswerEntity} from "../../../src/schemas/pet-checklist-answer.entity";
import {PetChecklistAnswer} from "../../../src/pet/pet.checklist-answer.domain";

export class FakePetChecklistAnswerRepository implements IPetChecklistAnswerRepository {
    private readonly answers:PetChecklistAnswerEntity[] = [];

    async create(dto:PetChecklistAnswer): Promise<PetChecklistAnswerEntity> {
        // 1) PetChecklistAnswerEntity - create) DTO 기반으로 객체 생성 (유효성 검사 및 객체 생성)
        // 2) TypeORM - create) TypeORM에서 사용하는 형식의 엔티티로 변환
        // 3) TypeORM - save) DB에 엔티티 저장
        const newAnswer:PetChecklistAnswerEntity = PetChecklistAnswerEntity.create(dto);
        this.answers.push(newAnswer);
        return newAnswer;
    }
}