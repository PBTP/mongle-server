import { Builder } from 'builder-pattern';
import { AuthProvider } from '../../../../src/auth/presentation/user.dto';
import { PetService } from '../../../../src/pet/application/pet.service';
import { Pet } from '../../../../src/pet/pet.domain';
import { PetController } from '../../../../src/pet/presentation/pet.controller';
import { PetDto } from '../../../../src/pet/presentation/pet.dto';
import { BreedEntity } from '../../../../src/schemas/breed.entity';
import { CustomerEntity } from '../../../../src/schemas/customer.entity';
import { PetChecklistAnswerEntity } from '../../../../src/schemas/pet-checklist-answer.entity';
import { PetChecklistChoiceEntity } from '../../../../src/schemas/pet-checklist-chocie.entity';
import {
  ChecklistType,
  PetChecklistCategory,
  PetChecklistEntity,
} from '../../../../src/schemas/pet-checklist.entity';
import { Gender } from '../../../../src/schemas/pets.entity';
import { FakeCustomerRepository } from '../../../mock/fake.customer.repository';
import { FakeDateHolder, FakeUuidHolder } from '../../../mock/fake.holder';
import { FakeBreedRepository } from '../../../mock/pet/fake.breed.repository';
import { FakePetChecklistAnswerRepository } from '../../../mock/pet/fake.pet.checklist-answer.repository';
import { FakePetChecklistChoiceAnswerRepository } from '../../../mock/pet/fake.pet.checklist-choice-answer.repository';
import { FakePetChecklistChoiceRepository } from '../../../mock/pet/fake.pet.checklist-choice.repository';
import { FakePetChecklistRepository } from '../../../mock/pet/fake.pet.checklist.repository';
import { FakePetRepository } from '../../../mock/pet/fake.pet.repository';

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

    await setupInitialData(
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

  describe('GetChecklist', () => {
    test('체크리스트 조회', async () => {
      const category = PetChecklistCategory.HEALTH;
      const type = ChecklistType.ANSWER;
      const checklists = await petController.getChecklist(category, type);
      expect(checklists).toBeDefined();
      expect(Array.isArray(checklists)).toBe(true);
      expect(checklists[0].petChecklistCategory).toBe(category);
      expect(checklists[0].petChecklistType).toBe(type);
    });
  });

  describe('GetPetChecklist', () => {
    test('반려동물 체크리스트 조회', async () => {
      const category = PetChecklistCategory.HEALTH;
      const type = ChecklistType.ANSWER;
      const petId = 1;
      const checklists = await petController.getPetChecklist(
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
    test('반려동물 생성하기', async () => {
      const dto: PetDto = createPetDto();
      const customer = new CustomerEntity();
      customer.customerId = 1;
      customer.customerName = '홍길동';
      customer.authProvider = AuthProvider.APPLE;
      const pet = await petController.create(dto, customer);
      expect(pet).toBeDefined();
      expect(pet.petName).toBe(dto.petName);
      expect(pet.breed.breedId).toBe(dto.breedId);
      expect(pet.customer.customerName).toBe(customer.customerName);
      expect(pet.customer.authProvider).toBe(customer.authProvider);
    });
  });

  describe('GetAll', () => {
    test('모든 반려동물 조회', async () => {
      const customer = new CustomerEntity();
      customer.customerId = 1;
      const result = await petController.getAll(customer);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].customer.customerId).toBe(customer.customerId);
    });
  });

  describe('GetOne', () => {
    test('단일 반려동물 조회', async () => {
      const id = 1;
      const customer = new CustomerEntity();
      customer.customerId = 1;
      const pet = await petController.getOne(id, customer);
      expect(pet).toBeDefined();
      expect(pet.petId).toBe(id);
      expect(pet.customer.customerId).toBe(customer.customerId);
    });
  });

  describe('Update', () => {
    test('반려동물 정보 수정', async () => {
      const id = 1;
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
      const customer = new CustomerEntity();
      customer.customerId = 1;
      const result = await petController.update(id, dto, customer);
      expect(result).toBeDefined();
      expect(result.petName).toBe(dto.petName);
      expect(result.breed.breedId).toBe(dto.breedId);
      expect(result.petWeight).toBe(dto.petWeight);
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

export async function setupInitialData(
  fakeCustomerRepository: FakeCustomerRepository,
  fakeBreedRepository: FakeBreedRepository,
  fakePetRepository: FakePetRepository,
  fakePetChecklistRepository: FakePetChecklistRepository,
  fakePetChecklistChoiceRepository: FakePetChecklistChoiceRepository,
  fakePetChecklistAnswerRepository: FakePetChecklistAnswerRepository,
  fakePetChecklistChoiceAnswerRepository: FakePetChecklistChoiceAnswerRepository,
  fakeUuidHolder: FakeUuidHolder,
  fakeDateHolder: FakeDateHolder,
) {
  // Customer 초기 데이터 (생성 후 반환값 재사용)
  const customer: CustomerEntity = await fakeCustomerRepository.create({
    customerName: '홍길동',
    authProvider: AuthProvider.APPLE,
  });

  // Breed 초기 데이터
  fakeBreedRepository.create(
    {
      breedId: 1,
      breedName: '시고르잡종',
      breedDescription: '귀엽다',
      uuid: fakeUuidHolder.generatedUuid(),
    },
    fakeUuidHolder,
  );

  // Pet 초기 데이터
  const breed: BreedEntity = await fakeBreedRepository.getBreed(1);
  if (!breed) {
    throw new Error('Breed not found');
  }

  const petDto = createPetDto();

  const pet = await fakePetRepository.create(
    Pet.create(petDto, breed, customer, fakeUuidHolder, fakeDateHolder),
    customer,
    fakeDateHolder,
    fakeUuidHolder,
  );

  // PetChecklist 초기 데이터
  const checklist: PetChecklistEntity = await fakePetChecklistRepository.create(
    {
      petChecklistId: 1,
      petChecklistType: ChecklistType.ANSWER,
      petChecklistCategory: PetChecklistCategory.HEALTH,
      petChecklistContent: '반려동물의 현재 건강 상태가 어떤가요?',
    },
  );

  // PetChecklistChoice 초기 데이터
  const petChecklistChoice: PetChecklistChoiceEntity =
    await fakePetChecklistChoiceRepository.create({
      petChecklistChoiceId: 1,
      petChecklistChoiceContent: '좋다',
    });

  // PetChecklistAnswer 초기 데이터
  const petChecklistAnswer: PetChecklistAnswerEntity =
    await fakePetChecklistAnswerRepository.create({
      petChecklistId: checklist.petChecklistId,
      petId: pet.petId,
      petChecklistAnswer: 'Yes',
    });

  // Checklist에 Answer를 연결
  checklist.petChecklistAnswers = [petChecklistAnswer];
  await fakePetChecklistRepository.update(checklist.petChecklistId, checklist);

  await fakePetChecklistChoiceAnswerRepository.create({
    petId: pet.petId,
    petChecklistId: checklist.petChecklistId,
    petChecklistChoiceId: petChecklistChoice.petChecklistChoiceId,
  });
}
