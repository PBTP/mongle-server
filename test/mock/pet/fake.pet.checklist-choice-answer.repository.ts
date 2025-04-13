import { PetChecklistChoiceAnswer } from "@pet/pet.checklist-choice-answer.domain";
import { IPetChecklistChoiceAnswerRepository } from "@pet/port/pet.checklist-choice-answer.repository";
import { PetChecklistChoiceAnswerEntity } from "@schemas/pet-checklist-chocie-answer.entity";

export class FakePetChecklistChoiceAnswerRepository
  implements IPetChecklistChoiceAnswerRepository
{
  private choiceAnswers: PetChecklistChoiceAnswerEntity[] = [];

  async create(
    choiceAnswer: PetChecklistChoiceAnswer,
  ): Promise<PetChecklistChoiceAnswerEntity> {
    const newChoiceAnswer = PetChecklistChoiceAnswerEntity.create(choiceAnswer);
    newChoiceAnswer.petChecklistChoiceAnswerId = this.choiceAnswers.length + 1;
    this.choiceAnswers.push(newChoiceAnswer);
    return newChoiceAnswer;
  }

  async delete(
    choiceAnswer: PetChecklistChoiceAnswer,
  ): Promise<PetChecklistChoiceAnswerEntity> {
    // 1) PetChecklistChoiceAnswer -> PetChecklistChoiceAnswerEntity
    // 2) PetChecklistChoiceAnswerEntity 삭제
    const choiceAnswerToDelete =
      PetChecklistChoiceAnswerEntity.delete(choiceAnswer);
    this.choiceAnswers = this.choiceAnswers.filter(
      (ca) =>
        ca.petId !== choiceAnswerToDelete.petId ||
        ca.petChecklistId !== choiceAnswerToDelete.petChecklistId ||
        ca.petChecklistChoiceId !== choiceAnswerToDelete.petChecklistChoiceId,
    );
    return choiceAnswerToDelete;
  }
}
