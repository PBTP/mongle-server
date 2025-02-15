import { BadRequestException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { IDateHolder } from 'src/common/holder/date.holder';
import { IUUIDHolder } from 'src/common/holder/uuid.holders';
import { Pet } from '../../../src/pet/pet.domain';
import { PetDto } from '../../../src/pet/presentation/pet.dto';
import { BreedEntity } from '../../../src/schemas/breed.entity';
import { CustomerEntity } from '../../../src/schemas/customer.entity';
import { PetChecklistAnswerEntity } from '../../../src/schemas/pet-checklist-answer.entity';
import { Gender, PetEntity } from '../../../src/schemas/pets.entity';
import { FakeDateHolder, FakeUuidHolder } from '../../mock/fake.holder';

describe('Pet Domain', () => {
  let uuidHolder: IUUIDHolder;
  let dateHolder: IDateHolder;
  const date = new Date();
  const fakeCustomer: CustomerEntity = {} as CustomerEntity;
  const fakeBreed: BreedEntity = {} as BreedEntity;
  const fakeChecklistAnswer: PetChecklistAnswerEntity =
    {} as PetChecklistAnswerEntity;

  beforeEach(() => {
    uuidHolder = new FakeUuidHolder();
    dateHolder = new FakeDateHolder(date);
  });

  describe('create', () => {
    it('PetDto로부터 Pet 객체를 생성한다.', () => {
      const petDto: PetDto = Builder<PetDto>()
        .petName('몽글이')
        .petGender(Gender.FEMALE)
        .petBirthdate(date)
        .petWeight(10)
        .neuteredYn(false)
        .personality('귀엽다')
        .vaccinationStatus('completed')
        .breedId(1)
        .build();
      const pet: Pet = Pet.create(
        petDto,
        fakeBreed,
        fakeCustomer,
        uuidHolder,
        dateHolder,
      );

      expect(pet).toBeDefined();
      expect(pet.uuid).toBe('test-uuid-1');
      expect(pet.petName).toBe('몽글이');
      expect(pet.petGender).toBe(Gender.FEMALE);
      expect(pet.petBirthdate).toEqual(date);
      expect(pet.petWeight).toBe(10);
      expect(pet.neuteredYn).toBe(false);
      expect(pet.personality).toBe('귀엽다');
      expect(pet.vaccinationStatus).toBe('completed');
      expect(pet.breed).toBe(fakeBreed);
      expect(pet.customer).toEqual(fakeCustomer);
      expect(pet.createdAt).toEqual(dateHolder.now());
      expect(pet.modifiedAt).toEqual(dateHolder.now());
    });

    it('필수 필드 누락 시 BadRequestException을 발생시킨다.', () => {
      const petDto = Builder<PetDto>().petName('동글이').build();
      expect(() =>
        Pet.create(petDto, fakeBreed, fakeCustomer, uuidHolder, dateHolder),
      ).toThrow(BadRequestException);
    });
  });

  describe('from', () => {
    it('PetEntity로부터 Pet 객체를 생성한다', () => {
      const petEntity: PetEntity = Builder<PetEntity>()
        .petId(1)
        .petName('몽글이')
        .petGender(Gender.MALE)
        .petBirthdate(dateHolder.now())
        .petWeight(10)
        .neuteredYn(false)
        .personality('cute')
        .vaccinationStatus('')
        .createdAt(dateHolder.now())
        .modifiedAt(dateHolder.now())
        .deletedAt(dateHolder.now())
        .reviews([])
        .appointments([])
        .customer(fakeCustomer)
        .breed(fakeBreed)
        .petChecklistAnswer(fakeChecklistAnswer)
        .build();
      const pet: Pet = Pet.from(petEntity);

      expect(pet).toBeDefined();
      expect(pet.petId).toBe(1);
      expect(pet.petName).toBe('몽글이');
      expect(pet.petGender).toBe(Gender.MALE);
      expect(pet.petBirthdate).toEqual(dateHolder.now());
      expect(pet.petWeight).toBe(10);
      expect(pet.neuteredYn).toBe(false);
      expect(pet.personality).toBe('cute');
      expect(pet.vaccinationStatus).toBe('');
      expect(pet.reviews).toEqual([]);
      expect(pet.appointments).toEqual([]);
      expect(pet.breed).toBe(fakeBreed);
      expect(pet.customer).toBe(fakeCustomer);
      expect(pet.petChecklistAnswer).toBe(fakeChecklistAnswer);
    });
  });
});
