import {PetController} from "../../../../src/pet/presentation/pet.controller";
import {PetService} from "../../../../src/pet/application/pet.service";
import {UUIDHolder} from "../../../../src/common/holder/uuid.holders";
import {DateHolder} from "../../../../src/common/holder/date.holder";
import {IPetRepository, PetRepository} from "../../../../src/pet/port/pet.repository";
import {IPetChecklistRepository} from "../../../../src/pet/port/pet.checklist.repository";
import {IPetChecklistAnswerRepository} from "../../../../src/pet/port/pet.checklist-answer.repository";
import {IPetChecklistChoiceAnswerRepository} from "../../../../src/pet/port/pet.checklist-choice-answer.repository";
import {IBreedRepository} from "../../../../src/pet/port/breed.repository";
import {FakePetRepository} from "../../../mock/pet/fake.pet.repository";

describe('PetController', () => {
    let petController: PetController;
    const date = new Date();

    beforeEach(async () => {
        // const petService = new PetService(
        //     new UUIDHolder(),
        //     new DateHolder(),
        //     new FakePetRepository(),
        //     new IPetChecklistRepository(),
        //     new IPetChecklistAnswerRepository(),
        //     new IPetChecklistChoiceAnswerRepository(),
        //     new IBreedRepository(),
        // )
    })
})