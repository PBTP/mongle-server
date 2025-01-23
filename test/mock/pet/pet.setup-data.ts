import { Builder } from 'builder-pattern';
import { AuthProvider } from '../../../src/auth/presentation/user.dto';
import { Pet } from '../../../src/pet/pet.domain';
import { PetDto } from '../../../src/pet/presentation/pet.dto';
import { BreedEntity } from '../../../src/schemas/breed.entity';
import { CustomerEntity } from '../../../src/schemas/customer.entity';
import { PetChecklistAnswerEntity } from '../../../src/schemas/pet-checklist-answer.entity';
import { PetChecklistChoiceEntity } from '../../../src/schemas/pet-checklist-chocie.entity';
import {
  ChecklistType,
  PetChecklistCategory,
  PetChecklistEntity,
} from '../../../src/schemas/pet-checklist.entity';
import { Gender } from '../../../src/schemas/pets.entity';
import { FakeCustomerRepository } from '../fake.customer.repository';
import { FakeDateHolder, FakeUuidHolder } from '../fake.holder';
import { FakeBreedRepository } from './fake.breed.repository';
import { FakePetChecklistAnswerRepository } from './fake.pet.checklist-answer.repository';
import { FakePetChecklistChoiceAnswerRepository } from './fake.pet.checklist-choice-answer.repository';
import { FakePetChecklistChoiceRepository } from './fake.pet.checklist-choice.repository';
import { FakePetChecklistRepository } from './fake.pet.checklist.repository';
import { FakePetRepository } from './fake.pet.repository';

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

export default function createPetDto(overrides?: Partial<PetDto>): PetDto {
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
