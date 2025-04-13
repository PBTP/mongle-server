import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { AuthProvider } from "@auth/presentation/user.dto";
import { PetService } from "@pet/application/pet.service";
import { PetController } from "@pet/presentation/pet.controller";
import { PetDto } from "@pet/presentation/pet.dto";
import { CustomerEntity } from "@schemas/customer.entity";
import {
  ChecklistType,
  PetChecklistCategory,
} from "@schemas/pet-checklist.entity";
import { Gender } from "@schemas/pets.entity";
import { FakeCustomerRepository } from "@mock/fake.customer.repository";
import { FakeDateHolder, FakeUuidHolder } from "@mock/fake.holder";
import { FakeBreedRepository } from "@mock/pet/fake.breed.repository";
import { FakePetChecklistAnswerRepository } from "@mock/pet/fake.pet.checklist-answer.repository";
import { FakePetChecklistChoiceAnswerRepository } from "@mock/pet/fake.pet.checklist-choice-answer.repository";
import { FakePetChecklistChoiceRepository } from "@mock/pet/fake.pet.checklist-choice.repository";
import { FakePetChecklistRepository } from "@mock/pet/fake.pet.checklist.repository";
import { FakePetRepository } from "@mock/pet/fake.pet.repository";
import createPetDto, {
  setupInitialPetData,
} from '@mock/pet/pet.setup-data';

describe('PetController', () => {
  let petController: PetController;
  let fakeCustomerRepository: FakeCustomerRepository;
  let fakeBreedRepository: FakeBreedRepository;
  let fakePetRepository: FakePetRepository;
  const date = new Date();
  let fakeUuidHolder: FakeUuidHolder;
  let fakeDateHolder: FakeDateHolder;
  let fakePetChecklistRepository: FakePetChecklistRepository;
  let fakePetChecklistChoiceRepository: FakePetChecklistChoiceRepository;
  let fakePetChecklistAnswerRepository: FakePetChecklistAnswerRepository;
  let fakePetChecklistChoiceAnswerRepository: FakePetChecklistChoiceAnswerRepository;

  beforeEach(async () => {
    fakeCustomerRepository = new FakeCustomerRepository();
    fakeBreedRepository = new FakeBreedRepository();
    fakePetRepository = new FakePetRepository();
    fakePetChecklistRepository = new FakePetChecklistRepository();
    fakePetChecklistChoiceRepository = new FakePetChecklistChoiceRepository();
    fakePetChecklistAnswerRepository = new FakePetChecklistAnswerRepository();
    fakePetChecklistChoiceAnswerRepository =
      new FakePetChecklistChoiceAnswerRepository();
    fakeUuidHolder = new FakeUuidHolder();
    fakeDateHolder = new FakeDateHolder(date);

    await setupInitialPetData(
      fakeCustomerRepository,
      fakeBreedRepository,
      fakePetRepository,
      fakePetChecklistRepository,
      fakePetChecklistChoiceRepository,
      fakePetChecklistAnswerRepository,
      fakePetChecklistChoiceAnswerRepository,
      fakeUuidHolder,
      fakeDateHolder,
    );

    const petService = new PetService(
      fakeUuidHolder,
      fakeDateHolder,
      fakePetRepository,
      fakePetChecklistRepository,
      new FakePetChecklistAnswerRepository(),
      new FakePetChecklistChoiceAnswerRepository(),
      fakeBreedRepository,
    );

    petController = new PetController(petService);
  });

  describe('FindChecklist', () => {
    test('체크리스트 조회', async () => {
      const category = PetChecklistCategory.HEALTH;
      const type = ChecklistType.ANSWER;
      const checklists = await petController.findChecklist(category, type);
      expect(checklists).toBeDefined();
      expect(Array.isArray(checklists)).toBe(true);
      expect(checklists[0].petChecklistCategory).toBe(category);
      expect(checklists[0].petChecklistType).toBe(type);
      expect(checklists[0].petChecklistChoices).toBeNull();
    });
  });

  describe('FindPetChecklist', () => {
    test('반려동물 체크리스트 조회', async () => {
      const category = PetChecklistCategory.HEALTH;
      const type = ChecklistType.ANSWER;
      const petId = 1;
      const checklists = await petController.findPetChecklist(
        petId,
        category,
        type,
      );
      expect(checklists).toBeDefined();
      expect(Array.isArray(checklists)).toBe(true);
      expect(checklists[0].petChecklistCategory).toBe(category);
      expect(checklists[0].petChecklistType).toBe(type);
    });
  });

  describe('AnswerChecklist', () => {
    test('체크리스트 답변하기', async () => {
      const petId = 1;
      const dto = [
        {
          petId,
          petChecklistId: 1,
          petChecklistChoiceId: 1,
          petChecklistAnswer: 'Yes',
          checked: true,
        },
      ];
      const customer = new CustomerEntity();
      customer.customerId = 1;
      const result = await petController.answerChecklist(petId, dto, customer);
      expect(result).toEqual(dto);
      expect(result[0].petId).toBe(petId);
      expect(result[0].petChecklistId).toBe(1);
      expect(result[0].checked).toBe(true);
      expect(result[0].petChecklistAnswer).toBe('Yes');
    });
  });

  describe('Create', () => {
    const customer = new CustomerEntity();
    customer.customerId = 1;
    customer.customerName = '홍길동';
    customer.authProvider = AuthProvider.APPLE;
    test('반려동물 생성하기', async () => {
      const dto: PetDto = createPetDto();
      const pet = await petController.create(dto, customer);
      expect(pet).toBeDefined();
      expect(pet.petName).toBe(dto.petName);
      expect(pet.breed.breedId).toBe(dto.breedId);
      expect(pet.customer.customerName).toBe(customer.customerName);
      expect(pet.customer.authProvider).toBe(customer.authProvider);
    });
    test('PetDto의 breedId가 존재하지 않을 때 BadRequestException을 발생시킨다.', async () => {
      const dto = Builder<PetDto>()
        .petName('몽글이')
        .petGender(Gender.MALE)
        .petBirthdate(new Date())
        .petWeight(10)
        .neuteredYn(true)
        .personality('cute')
        .vaccinationStatus('미완료')
        .appointments([])
        .breedId(99999) // invalid breedId 부여
        .build();
      // Promise의 실패는 rejects 체인으로 catch
      await expect(petController.create(dto, customer)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('FindAll', () => {
    test('모든 반려동물 조회', async () => {
      const customer = new CustomerEntity();
      customer.customerId = 1;
      const result = await petController.findAll(customer);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].customer.customerId).toBe(customer.customerId);
    });
  });

  describe('GetOne', () => {
    const id = 1;
    const customer = new CustomerEntity();
    test('단일 반려동물 조회', async () => {
      customer.customerId = 1;
      const pet = await petController.getOne(id, customer);
      expect(pet).toBeDefined();
      expect(pet.petId).toBe(id);
      expect(pet.customer.customerId).toBe(customer.customerId);
    });
    test('customerId가 일치하지 않으면 ForbiddenException을 발생시킨다.', async () => {
      customer.customerId = 2;
      await expect(petController.getOne(id, customer)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('Update', () => {
    const id = 1;
    const customer = new CustomerEntity();
    const dto: Omit<PetDto, 'petId'> = {
      petName: '동글이',
      breedId: 1,
      petBirthdate: new Date(),
      petWeight: 12,
      neuteredYn: true,
      personality: 'shy',
      vaccinationStatus: 'completed',
      petGender: Gender.FEMALE,
      appointments: [],
    };
    test('반려동물 정보 수정', async () => {
      customer.customerId = 1;
      const result = await petController.update(id, dto, customer);
      expect(result).toBeDefined();
      expect(result.petName).toBe(dto.petName);
      expect(result.breed.breedId).toBe(dto.breedId);
      expect(result.petWeight).toBe(dto.petWeight);
    });
    test('customerId가 일치하지 않으면 ForbiddenException을 발생시킨다.', async () => {
      customer.customerId = 2;
      await expect(petController.update(id, dto, customer)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('Delete', () => {
    test('반려동물 삭제', async () => {
      const id = 1;
      const customer = new CustomerEntity();
      customer.customerId = 1;
      // 삭제 전 확인
      const petBeforeDelete = await petController.getOne(id, customer);
      expect(petBeforeDelete).toBeDefined();
      expect(petBeforeDelete.petId).toBe(id);

      // 삭제 실행
      await petController.delete(id, customer);

      // 삭제 후 확인
      expect(petController.getOne(id, customer)).rejects.toThrowError(
        '존재하지 않는 펫입니다.',
      );
    });
  });
});
