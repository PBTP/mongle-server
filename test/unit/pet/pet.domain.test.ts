import {Gender, PetEntity} from "../../../src/schemas/pets.entity";
import {Builder} from "builder-pattern";
import {IDateHolder} from "../../../src/common/holder/date.holder";
import {FakeDateHolder, FakeUuidHolder} from "../../mock/fake.holder";
import {CustomerEntity} from "../../../src/schemas/customer.entity";
import {BreedEntity} from "../../../src/schemas/breed.entity";
import {PetChecklistAnswerEntity} from "../../../src/schemas/pet-checklist-answer.entity";
import {Pet} from "../../../src/pet/pet.domain";
import {PetDto} from "../../../src/pet/presentation/pet.dto";
import {IUUIDHolder} from "../../../src/common/holder/uuid.holders";

describe('Pet', () => {
    let uuidHolder: IUUIDHolder;
    let dateHolder: IDateHolder;
    const date = new Date();
    const fakeCustomer: CustomerEntity = {} as CustomerEntity;
    const fakeBreed: BreedEntity = {} as BreedEntity;
    const fakeChecklistAnswer: PetChecklistAnswerEntity = {} as PetChecklistAnswerEntity;

    beforeEach(() => {
        uuidHolder = new FakeUuidHolder();
        dateHolder = new FakeDateHolder(date);
    })

    describe(('from'), () => {
        it('PetEntity로부터 Pet 객체를 생성한다', () => {
            const petEntity: PetEntity = Builder<PetEntity>()
                .petId(1)
                .petName("몽글이")
                .petGender(Gender.MALE)
                .petBirthdate(dateHolder.now())
                .petWeight(10)
                .neuteredYn(false)
                .personality("cute")
                .vaccinationStatus("")
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
            expect(pet.petName).toBe("몽글이");
            expect(pet.petGender).toBe(Gender.MALE);
            expect(pet.petBirthdate).toEqual(dateHolder.now());
            expect(pet.petWeight).toBe(10);
            expect(pet.neuteredYn).toBe(false);
            expect(pet.personality).toBe("cute");
            expect(pet.vaccinationStatus).toBe("");
            expect(pet.reviews).toEqual([]);
            expect(pet.appointments).toEqual([]);
            expect(pet.breed).toBe(fakeBreed);
            expect(pet.customer).toBe(fakeCustomer);
            expect(pet.petChecklistAnswer).toBe(fakeChecklistAnswer);
        });

        describe('create', () => {
            it('PetDto로부터 Pet 객체를 생성한다.', () => {
                const petDto: PetDto = Builder<PetDto>()
                    .petName('몽글이')
                    .petGender(Gender.FEMALE)
                    .petBirthdate(dateHolder.now())
                    .petWeight(10)
                    .neuteredYn(false)
                    .personality('')
                    .vaccinationStatus('')
                    .breedId(1)
                    .build();
                const pet: Pet = Pet.create(petDto, fakeBreed, fakeCustomer, uuidHolder, dateHolder);

                expect(pet).toBeDefined();
                expect(pet.petName).toBe('몽글이');
                expect(pet.petGender).toBe(Gender.FEMALE);
                // expect(pet.petBirthdate).toEqual(dateHolder.now());
                expect(pet.petWeight).toBe(10);
                expect(pet.neuteredYn).toBe(false);
                expect(pet.personality).toBe('');
                expect(pet.vaccinationStatus).toBe('');
                expect(pet.breed).toBe(fakeBreed);
                expect(pet.customer).toBe(fakeCustomer);
                expect(pet.uuid).toBe(uuidHolder.generatedUuid());
                expect(pet.createdAt).toEqual(dateHolder.now());
                expect(pet.modifiedAt).toEqual(dateHolder.now());
            });
        });

    });
})
