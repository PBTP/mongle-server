import { ForbiddenException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { AuthProvider } from "@auth/presentation/user.dto";
import { Customer } from "@customer/customer.domain";
import { PetService } from "@pet/application/pet.service";
import {
  PetChecklistAnswerDto,
  PetDto,
} from "@pet/presentation/pet.dto";
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
import { setupInitialPetData } from "@mock/pet/pet.setup-data";

describe('PetService', () => {
  let service: PetService;
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

  const customer: Customer = {
    customerId: 1,
    customerName: '홍길동',
    authProvider: AuthProvider.BASIC,
  };

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

    service = new PetService(
      fakeUuidHolder,
      fakeDateHolder,
      fakePetRepository,
      fakePetChecklistRepository,
      fakePetChecklistAnswerRepository,
      fakePetChecklistChoiceAnswerRepository,
      fakeBreedRepository,
    );
  });

  describe('create', () => {
    test('반려동물 엔티티 생성', async () => {
      const petDto: PetDto = createPetDto();

      const pet = await service.create(petDto, customer);

      expect(pet).toBeDefined();
      expect(pet.petName).toBe('몽글이');
      expect(pet.breed.breedId).toBe(1);
      expect(pet.customer.customerId).toBe(1);
      expect(pet.customer.customerName).toBe('홍길동');
      expect(pet.customer.authProvider).toBe(AuthProvider.BASIC);
    });
  });

  describe('findAll', () => {
    test('특정 고객의 전체 반려동물 조회', async () => {
      const pets = await service.findAll(customer);
      expect(pets).toBeDefined();
    });
  });

  describe('getOne', () => {
    const petDto: PetDto = createPetDto();
    test('반려동물 단일 조회', async () => {
      const createdPet = await service.create(petDto, customer);
      const pet = await service.getOne(createdPet.petId, customer);
      expect(pet).toBeDefined();
      expect(pet.petId).toBe(createdPet.petId);
      expect(pet.petName).toBe(createdPet.petName);
    });

    test('특정 customer의 pet이 아닐 경우 ForbiddenException를 발생시킨다', async () => {
      customer.customerId = 999;
      await expect(service.getOne(1, customer)).rejects.toThrow(
        ForbiddenException,
      );
      customer.customerId = 1;
    });
  });

  describe('update', () => {
    test('반려동물 정보 수정', async () => {
      const petDto: PetDto = createPetDto();

      const prevPet = await service.create(petDto, customer);
      const updatedPet = await service.update(
        prevPet.petId,
        { petName: '동글이' },
        customer,
      );

      expect(updatedPet).toBeDefined();
      expect(updatedPet.petName).toBe('동글이');
      expect(updatedPet.petId).toBe(prevPet.petId);
    });
  });

  describe('findCheckList', () => {
    test('반려동물 체크리스트 조회', async () => {
      const checklist = await service.findCheckList(
        PetChecklistCategory.HEALTH,
        ChecklistType.ANSWER,
        null,
      );
      expect(checklist).toBeDefined();
      expect(Array.isArray(checklist)).toBe(true);
    });
    test('체크리스트 타입이 Choice일 때 petChecklistAnswer는 null이다.', async () => {
      const checklist = await service.findCheckList(
        PetChecklistCategory.HEALTH,
        ChecklistType.ANSWER,
        null,
      );
      expect(checklist[0].petChecklistChoices).toBeNull();
      expect(checklist[0].petChecklistAnswer).toBeDefined();
    });
  });

  describe('answerChecklist', () => {
    test('반려동물 체크리스트 답변', async () => {
      const pet = await fakePetRepository.getOneById(1);
      const answers: PetChecklistAnswerDto[] = [
        {
          petId: pet.petId,
          petChecklistId: 1,
          petChecklistChoiceId: 1,
          petChecklistAnswer: '귀엽다',
          checked: true,
        },
      ];
      await service.answerChecklist(pet.petId, answers, customer);

      const checklist = await service.findCheckList(
        PetChecklistCategory.HEALTH,
        ChecklistType.ANSWER,
        pet.petId,
      );

      expect(checklist).toBeDefined();
      expect(Array.isArray(checklist)).toBe(true);
      expect(checklist[0].petChecklistAnswer).toBe('Yes');
    });
  });
});

function createPetDto(overrides?: Partial<PetDto>): PetDto {
  const basePetDto = Builder<PetDto>()
    .petName('몽글이')
    .petGender(Gender.MALE)
    .petBirthdate(new Date())
    .petWeight(10)
    .neuteredYn(true)
    .personality('cute')
    .vaccinationStatus('미완료')
    .appointments([])
    .breedId(1)
    .build();

  return { ...basePetDto, ...overrides };
}
