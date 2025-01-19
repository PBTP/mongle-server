import { AuthProvider } from '../../../../src/auth/presentation/user.dto';
import { DateHolder } from '../../../../src/common/holder/date.holder';
import { UUIDHolder } from '../../../../src/common/holder/uuid.holders';
import { PetService } from '../../../../src/pet/application/pet.service';
import { PetController } from '../../../../src/pet/presentation/pet.controller';
import { PetDto } from '../../../../src/pet/presentation/pet.dto';
import { CustomerEntity } from '../../../../src/schemas/customer.entity';
import { Gender } from '../../../../src/schemas/pets.entity';
import { FakeUuidHolder } from '../../../mock/fake.holder';
import { FakeBreedRepository } from '../../../mock/pet/fake.breed.repository';
import { FakePetChecklistAnswerRepository } from '../../../mock/pet/fake.pet.checklist-answer.repository';
import { FakePetChecklistChoiceAnswerRepository } from '../../../mock/pet/fake.pet.checklist-choice-answer.repository';
import { FakePetChecklistRepository } from '../../../mock/pet/fake.pet.checklist.repository';
import { FakePetRepository } from '../../../mock/pet/fake.pet.repository';

describe('PetController', () => {
  let petController: PetController;
  const date = new Date();
  const fakeUuidHolder = new FakeUuidHolder();

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
    petController = new PetController(petService);
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
    test('체크리스트 답변하기', async () => {
      const dto: PetDto = {
        petName: 'Mongle',
        breedId: 1,
        petBirthdate: new Date(),
        petWeight: 10,
        neuteredYn: true,
        personality: 'Friendly',
        vaccinationStatus: 'completed',
        petGender: Gender.FEMALE,
        appointments: [],
      };
      const customer = new CustomerEntity(); // 위와 같이 객체 리터럴로 생성 시 메소드와 상속 관계가 고려되지 않아아 에러 발생
      customer.customerId = 1;
      customer.customerName = 'John Doe';
      customer.authProvider = AuthProvider.APPLE;
      customer.createdAt = date;
      customer.modifiedAt = date;
      customer.favorites = [];
      customer.reviews = [];
      customer.appointments = [];
      customer.pets = [];
      customer.chatRooms = [];
      customer.uuid = fakeUuidHolder.generatedUuid();
      const result = await petController.create(dto, customer);
      expect(result).toBeDefined();
    });
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
