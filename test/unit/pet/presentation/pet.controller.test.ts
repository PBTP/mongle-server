import { Builder } from 'builder-pattern';
import { AuthProvider } from '../../../../src/auth/presentation/user.dto';
import { PetService } from '../../../../src/pet/application/pet.service';
import { Pet } from '../../../../src/pet/pet.domain';
import { PetController } from '../../../../src/pet/presentation/pet.controller';
import { PetDto } from '../../../../src/pet/presentation/pet.dto';
import { BreedEntity } from '../../../../src/schemas/breed.entity';
import { CustomerEntity } from '../../../../src/schemas/customer.entity';
import { Gender } from '../../../../src/schemas/pets.entity';
import { FakeCustomerRepository } from '../../../mock/fake.customer.repository';
import { FakeDateHolder, FakeUuidHolder } from '../../../mock/fake.holder';
import { FakeBreedRepository } from '../../../mock/pet/fake.breed.repository';
import { FakePetChecklistAnswerRepository } from '../../../mock/pet/fake.pet.checklist-answer.repository';
import { FakePetChecklistChoiceAnswerRepository } from '../../../mock/pet/fake.pet.checklist-choice-answer.repository';
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

  beforeEach(async () => {
    fakeCustomerRepository = new FakeCustomerRepository();
    fakeBreedRepository = new FakeBreedRepository();
    fakePetRepository = new FakePetRepository();
    fakeUuidHolder = new FakeUuidHolder();
    fakeDateHolder = new FakeDateHolder(date);

    await setupInitialData(
      fakeCustomerRepository,
      fakeBreedRepository,
      fakePetRepository,
      fakeUuidHolder,
      fakeDateHolder,
    );

    const petService = new PetService(
      fakeUuidHolder,
      fakeDateHolder,
      fakePetRepository,
      new FakePetChecklistRepository(),
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
      const result = await petController.getChecklist(category, type);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('GetPetChecklist', () => {
    test('반려동물 체크리스트 조회', async () => {
      const category = PetChecklistCategory.HEALTH;
      const type = ChecklistType.ANSWER;
      const petId = 1;
      const result = await petController.getPetChecklist(petId, category, type);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // describe('AnswerChecklist', () => {
  //   test('체크리스트 답변하기', async () => {
  //     const petId = 1;
  //     const dto = [
  //       {
  //         petId,
  //         petChecklistId: 1,
  //         petChecklistChoiceId: 1,
  //         petChecklistAnswer: '답변',
  //         checked: true,
  //       },
  //     ];
  //     const customer = new CustomerEntity();
  //     customer.customerId = 1;
  //     const result = await petController.answerChecklist(petId, dto, customer);
  //     expect(result).toEqual(dto);
  //   });
  // });

  describe('Create', () => {
    test('반려동물 생성하기', async () => {
      const dto: PetDto = createPetDto();
      const customer = new CustomerEntity();
      customer.customerId = 1;
      customer.customerName = '홍길동';
      customer.authProvider = AuthProvider.APPLE;
      const pet = await petController.create(dto, customer);
      expect(pet).toBeDefined();
      expect(pet.customer.customerName).toBe('홍길동');
      expect(pet.customer.authProvider).toBe(AuthProvider.APPLE);
    });
  });

  describe('GetAll', () => {
    test('모든 반려동물 조회', async () => {
      const customer = new CustomerEntity();
      customer.customerId = 1;
      const result = await petController.getAll(customer);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  //   describe('GetOne', () => {
  //     test('단일 반려동물 조회', async () => {
  //       const id = 1;
  //       const customer = new CustomerEntity();
  //       customer.customerId = 1;
  //       const result = await petController.getOne(id, customer);
  //       expect(result).toBeDefined();
  //       expect(result.petId).toBe(id);
  //     });
  //   });

  //   describe('Update', () => {
  //     test('반려동물 정보 수정', async () => {
  //       const id = 1;
  //       const dto: Omit<PetDto, 'petId'> = {
  //         petName: 'Mongle Updated',
  //         breedId: 1,
  //         petBirthdate: new Date(),
  //         petWeight: 12,
  //         neuteredYn: true,
  //         personality: 'Updated Personality',
  //         vaccinationStatus: 'completed',
  //         petGender: Gender.MALE,
  //         appointments: [],
  //       };
  //       const customer = new CustomerEntity();
  //       customer.customerId = 1;
  //       const result = await petController.update(id, dto, customer);
  //       expect(result).toBeDefined();
  //       expect(result.petName).toBe(dto.petName);
  //     });
  //   });

  //   describe('Delete', () => {
  //     test('반려동물 삭제', async () => {
  //       const id = 1;
  //       const customer = new CustomerEntity();
  //       customer.customerId = 1;
  //       await expect(petController.delete(id, customer)).resolves.toBeUndefined();
  //     });
  //   });
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
  fakeUuidHolder: FakeUuidHolder,
  fakeDateHolder: FakeDateHolder,
) {
  // Create customer
  await fakeCustomerRepository.create({
    customerName: '홍길동',
    authProvider: AuthProvider.APPLE,
  });

  // Create breed
  await fakeBreedRepository.create(
    {
      breedId: 1,
      breedName: '시고르잡종',
      breedDescription: '귀엽다',
      uuid: fakeUuidHolder.generatedUuid(),
    },
    fakeUuidHolder,
  );

  const customer = {
    customerName: '홍길동',
    authProvider: AuthProvider.APPLE,
  };

  const breed: BreedEntity = await fakeBreedRepository.getBreed(1);
  if (!breed) {
    throw new Error('Breed not found');
  }

  const petDto = createPetDto();

  // Create pet
  const pet = Pet.create(
    petDto,
    breed,
    customer,
    fakeUuidHolder,
    fakeDateHolder,
  );

  await fakePetRepository.create(pet, customer, fakeDateHolder, fakeUuidHolder);
}
