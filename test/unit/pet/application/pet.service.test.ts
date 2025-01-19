import { Builder } from 'builder-pattern';
import { AuthProvider } from '../../../../src/auth/presentation/user.dto';
import { Customer } from '../../../../src/customer/customer.domain';
import { PetService } from '../../../../src/pet/application/pet.service';
import { PetDto } from '../../../../src/pet/presentation/pet.dto';
import { FakeDateHolder, FakeUuidHolder } from '../../../mock/fake.holder';
import { FakeBreedRepository } from '../../../mock/pet/fake.breed.repository';
import { FakePetChecklistAnswerRepository } from '../../../mock/pet/fake.pet.checklist-answer.repository';
import { FakePetChecklistChoiceAnswerRepository } from '../../../mock/pet/fake.pet.checklist-choice-answer.repository';
import { FakePetChecklistRepository } from '../../../mock/pet/fake.pet.checklist.repository';
import { FakePetRepository } from '../../../mock/pet/fake.pet.repository';

describe('PetService', () => {
  let service: PetService;
  let fakeBreedRepository: FakeBreedRepository;

  const customer: Customer = {
    customerId: 1,
    customerName: '홍길동',
    authProvider: AuthProvider.BASIC,
  };

  beforeEach(() => {
    fakeBreedRepository = new FakeBreedRepository();
    fakeBreedRepository.create(
      {
        breedId: 1,
        breedName: '시고르잡종',
        breedDescription: '귀엽다',
        uuid: '',
      },
      new FakeUuidHolder(),
    );

    const date = new Date();
    service = new PetService(
      new FakeUuidHolder(),
      new FakeDateHolder(date),
      new FakePetRepository(),
      new FakePetChecklistRepository(),
      new FakePetChecklistAnswerRepository(),
      new FakePetChecklistChoiceAnswerRepository(),
      fakeBreedRepository,
    );
  });

  // 👍🏼describe('create', () => {
  //   test('반려동물 엔티티 생성', async () => {
  //     const petDto: PetDto = Builder<PetDto>()
  //       .petName('몽글이')
  //       .petGender(Gender.MALE)
  //       .petBirthdate(new Date())
  //       .petWeight(10)
  //       .neuteredYn(true)
  //       .personality('cute')
  //       .vaccinationStatus('미완료')
  //       .appointments([])
  //       .breedId(1)
  //       .build();

  //     const pet = await service.create(petDto, customer);

  //     expect(pet).toBeDefined();
  //     expect(pet.petName).toBe('몽글이');
  //     expect(pet.breed.breedId).toBe(1);
  //     // expect(pet.customer.customerId).toBe(1);
  //     expect(pet.customer.customerName).toBe('홍길동');
  //     expect(pet.customer.authProvider).toBe(AuthProvider.BASIC);
  //   });
  // });

  // 👍🏼describe('findAll', () => {
  //   test('특정 고객의 전체 반려동물 조회', async () => {
  //     const pet1: PetDto = Builder<PetDto>()
  //       .petName('몽글이')
  //       .petGender(Gender.FEMALE)
  //       .petBirthdate(new Date())
  //       .petWeight(10)
  //       .neuteredYn(true)
  //       .personality('cute')
  //       .vaccinationStatus('미완료')
  //       .breedId(1)
  //       .neuteredYn(true)
  //       .appointments([])
  //       .build();

  //     const pet2: PetDto = Builder<PetDto>()
  //       .petName('동글이')
  //       .petGender(Gender.MALE)
  //       .petBirthdate(new Date())
  //       .petWeight(10)
  //       .neuteredYn(true)
  //       .personality('cute')
  //       .vaccinationStatus('미완료')
  //       .breedId(1)
  //       .neuteredYn(true)
  //       .appointments([])
  //       .build();

  //     await service.create(pet1, customer);
  //     await service.create(pet2, customer);

  //     const pets = await service.findAll(customer);

  //     expect(pets).toBeDefined();
  //     expect(pets.length).toBe(2);
  //     expect(pets[0].petName).toBe('몽글이');
  //     expect(pets[1].petName).toBe('동글이');
  //   });
  // });

  describe('findOne', () => {
    test('반려동물 단일 조회', async () => {
      const petDto: PetDto = Builder<PetDto>()
        .petName('몽글이')
        .breedId(1)
        .build();
      const createdPet = await service.create(petDto, customer);
      const pet = await service.findOne(createdPet.petId, customer);

      expect(pet).toBeDefined();
      expect(pet.petId).toBe(createdPet.petId);
      expect(pet.petName).toBe(createdPet.petName);
    });
  });

  // describe('update', () => {
  //   test('반려동물 정보 수정', async () => {
  //     const petDto: PetDto = Builder<PetDto>()
  //       .petName('몽글이')
  //       .petGender(Gender.MALE)
  //       .petBirthdate(new Date())
  //       .petWeight(10)
  //       .neuteredYn(true)
  //       .personality('cute')
  //       .vaccinationStatus('미접종')
  //       .breedId(1)
  //       .build();

  //     const prevPet = await service.create(petDto, customer);
  //     const updatedPet = await service.update(
  //       prevPet.petId,
  //       { petName: '동글이' },
  //       customer,
  //     );

  //     expect(updatedPet).toBeDefined();
  //     expect(updatedPet.petName).toBe('동글이');
  //     expect(updatedPet.petId).toBe(prevPet.petId);
  //   });
  // });

  // 👍🏼describe('findCheckList', () => {
  //   test('반려동물 체크리스트 조회', async () => {
  //     const checklist = await service.findCheckList(
  //       PetChecklistCategory.HEALTH,
  //       ChecklistType.ANSWER,
  //       null,
  //     );

  //     expect(checklist).toBeDefined();
  //     expect(Array.isArray(checklist)).toBe(true);
  //   });
  // });

  // describe('answerChecklist', () => {
  //   test('반려동물 체크리스트 답변', async () => {
  //     const petDto: PetDto = Builder<PetDto>()
  //       .petName('멍멍이')
  //       .breedId(1)
  //       .build();

  //     const pet = await service.create(petDto, customer);

  //     const answers: PetChecklistAnswerDto[] = [
  //       {
  //         petId: pet.petId,
  //         petChecklistId: 2,
  //         petChecklistChoiceId: 1,
  //         petChecklistAnswer: '귀엽다',
  //         checked: true,
  //       },
  //     ];

  //     await service.answerChecklist(pet.petId, answers, customer);

  //     const checklist = await service.findCheckList(
  //       PetChecklistCategory.HEALTH,
  //       ChecklistType.ANSWER,
  //       pet.petId,
  //     );

  //     expect(checklist[0].petChecklistAnswer).toBe('귀엽다');
  //   });
  // });
});
