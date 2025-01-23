import { Builder } from 'builder-pattern';
import { AuthProvider } from '../../../../src/auth/presentation/user.dto';
import { Customer } from '../../../../src/customer/customer.domain';
import { PetService } from '../../../../src/pet/application/pet.service';
import { Pet } from '../../../../src/pet/pet.domain';
import {
  PetChecklistAnswerDto,
  PetDto,
} from '../../../../src/pet/presentation/pet.dto';
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

  describe('findOne', () => {
    test('반려동물 단일 조회', async () => {
      const petDto: PetDto = createPetDto();
      const createdPet = await service.create(petDto, customer);
      const pet = await service.findOne(createdPet.petId, customer);

      expect(pet).toBeDefined();
      expect(pet.petId).toBe(createdPet.petId);
      expect(pet.petName).toBe(createdPet.petName);
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
  });

  describe('answerChecklist', () => {
    test('반려동물 체크리스트 답변', async () => {
      const pet = await fakePetRepository.findOneById(1);
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
