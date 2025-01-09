import {IPetChecklistChoiceAnswerRepository} from "../../../src/pet/port/pet.checklist-choice-answer.repository";
import {PetChecklistChoiceAnswerEntity} from "../../../src/schemas/pet-checklist-chocie-answer.entity";
import {PetChecklistChoiceAnswer} from "../../../src/pet/pet.checklist-choice-answer.domain";

export class FakePetChecklistChoiceAnswerRepository implements IPetChecklistChoiceAnswerRepository {
    private choiceAnswers:PetChecklistChoiceAnswerEntity[] = [];

    async create(
        choiceAnswer: PetChecklistChoiceAnswer,
    ): Promise<PetChecklistChoiceAnswerEntity> {
        const newChoiceAnswer = PetChecklistChoiceAnswerEntity.create(choiceAnswer);
        this.choiceAnswers.push(newChoiceAnswer);
        return newChoiceAnswer;
    }

    async delete(
        choiceAnswer: PetChecklistChoiceAnswer,
    ): Promise<PetChecklistChoiceAnswerEntity> {
        // 1) PetChecklistChoiceAnswer -> PetChecklistChoiceAnswerEntity
        // 2) PetChecklistChoiceAnswerEntity 삭제
        const choiceAnswerToDelete = PetChecklistChoiceAnswerEntity.delete(choiceAnswer);
        this.choiceAnswers = this.choiceAnswers.filter(
            (ca) =>
                ca.petId !== choiceAnswerToDelete.petId ||
                ca.petChecklistId !== choiceAnswerToDelete.petChecklistId ||
                ca.petChecklistChoiceId !== choiceAnswerToDelete.petChecklistChoiceId
        );
        return choiceAnswerToDelete;
    }
}