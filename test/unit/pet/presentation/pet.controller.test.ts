import { FakeBreedRepository } from 'test/mock/pet/fake.breed.repository';
import { FakePetChecklistAnswerRepository } from 'test/mock/pet/fake.pet.checklist-answer.repository';
import { FakePetChecklistChoiceAnswerRepository } from 'test/mock/pet/fake.pet.checklist-choice-answer.repository';
import { FakePetChecklistRepository } from 'test/mock/pet/fake.pet.checklist.repository';
import { DateHolder } from '../../../../src/common/holder/date.holder';
import { UUIDHolder } from '../../../../src/common/holder/uuid.holders';
import { PetService } from '../../../../src/pet/application/pet.service';
import { PetController } from '../../../../src/pet/presentation/pet.controller';
import { FakePetRepository } from '../../../mock/pet/fake.pet.repository';

describe('PetController', () => {
  let petController: PetController;
  const date = new Date();

  beforeEach(async () => {
    const petService = new PetService(
      new UUIDHolder(),
      new DateHolder(),
      new FakePetRepository(),
      new FakePetChecklistRepository(),
      new FakePetChecklistAnswerRepository(),
      new FakePetChecklistChoiceAnswerRepository(),
      new FakeBreedRepository(),
    );
  });

  describe('GetChecklist', () => {
    test('체크리스트 조회', async () => {});
  });

  describe('GetPetChecklist', () => {
    test('반려동물 체크리스트 조회', async () => {});
  });

  describe('AnswerChecklist', () => {
    test('체크리스트 답변하기', async () => {});
  });

  describe('Create', () => {
    test('체크리스트 답변하기', async () => {});
  });

  describe('GetAll', () => {
    test('체크리스트 답변하기', async () => {});
  });

  describe('GetOne', () => {
    test('단일 조회', async () => {});
  });

  describe('Update', () => {
    test('전체 조회', async () => {});
  });

  describe('Delete', () => {
    test('전체 조회', async () => {});
  });
});
