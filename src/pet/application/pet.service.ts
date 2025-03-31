import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Builder } from 'builder-pattern';
import { DATE_HOLDER, DateHolder } from '../../common/holder/date.holder';
import { UUID_HOLDER, UUIDHolder } from '../../common/holder/uuid.holders';
import { ICustomer } from '../../customer/customer.domain';
import {
  ChecklistType,
  PetChecklistCategory,
} from '../../schemas/pet-checklist.entity';
import { PetEntity } from '../../schemas/pets.entity';
import { PetChecklistAnswer } from '../pet.checklist-answer.domain';
import { PetChecklistChoiceAnswer } from '../pet.checklist-choice-answer.domain';
import { Pet } from '../pet.domain';
import { BREED_REPOSITORY, IBreedRepository } from '../port/bree.repository';
import {
  IPetChecklistAnswerRepository,
  PET_CHECKLIST_ANSWER_REPOSITORY,
} from '../port/pet.checklist-answer.repository';
import { IPetChecklistChoiceAnswerRepository } from '../port/pet.checklist-choice-answer.repository';
import { PET_CHECKLIST_CHOICE_REPOSITORY } from '../port/pet.checklist-choice.repository';
import {
  IPetChecklistRepository,
  PET_CHECKLIST_REPOSITORY,
} from '../port/pet.checklist.repository';
import { IPetRepository, PET_REPOSITORY } from '../port/pet.repository';
import {
  PetChecklistAnswerDto,
  PetChecklistChoiceDto,
  PetChecklistDto,
  PetDto,
} from '../presentation/pet.dto';
import { PetChecklist } from "../pet.checklist.domain";

@Injectable()
export class PetService {
  constructor(
    @Inject(UUID_HOLDER)
    private uuidHolder: UUIDHolder,
    @Inject(DATE_HOLDER)
    private dateHolder: DateHolder,
    @Inject(PET_REPOSITORY)
    private petRepository: IPetRepository,
    @Inject(PET_CHECKLIST_REPOSITORY)
    private petChecklistRepository: IPetChecklistRepository,
    @Inject(PET_CHECKLIST_ANSWER_REPOSITORY)
    private petChecklistAnswerRepository: IPetChecklistAnswerRepository,
    @Inject(PET_CHECKLIST_CHOICE_REPOSITORY)
    private petChecklistChoiceAnswerRepository: IPetChecklistChoiceAnswerRepository,
    @Inject(BREED_REPOSITORY)
    private breedRepository: IBreedRepository,
  ) {}

  async create(dto: PetDto, customer: ICustomer): Promise<Pet> {
    const breed = await this.breedRepository.getBreed(dto.breedId);

    return await this.petRepository.create(
      Pet.create(dto, breed, customer, this.uuidHolder, this.dateHolder),
      customer,
      this.dateHolder,
      this.uuidHolder,
    );
  }

  async findAll(customer: ICustomer): Promise<Pet[]> {
    return await this.petRepository.findAllByCustomer(customer);
  }

  async getOne(id: number, customer: ICustomer): Promise<Pet> {
    const pet = await this.petRepository.getOne(id);

    if (pet.customer.customerId !== customer.customerId) {
      throw new ForbiddenException('해당 반려동물에 접근할 수 없습니다.');
    }

    return pet;
  }

  async update(
    id: number,
    dto: Partial<PetDto>,
    customer: ICustomer,
  ): Promise<Pet> {
    const pet = await this.getOne(id, customer);

    if (dto.breedId && dto.breedId !== pet.breed.breedId) {
      pet.breed = await this.breedRepository.getBreed(dto.breedId);
    }

    pet.petName = dto.petName ?? pet.petName;
    pet.petBirthdate = dto.petBirthdate ?? pet.petBirthdate;
    pet.petWeight = dto.petWeight ?? pet.petWeight;
    pet.neuteredYn = dto.neuteredYn ?? pet.neuteredYn;
    pet.personality = dto.personality ?? pet.personality;
    pet.vaccinationStatus = dto.vaccinationStatus ?? pet.vaccinationStatus;
    pet.petGender = dto.petGender ?? pet.petGender;

    return await this.petRepository.update(pet, this.dateHolder);
  }

  async delete(id: number, customer: ICustomer): Promise<void> {
    const pet = await this.getOne(id, customer);

    await this.petRepository.delete(pet);
  }

  async findCheckList(
    category: PetChecklistCategory,
    type: ChecklistType,
    petId: number | null,
  ): Promise<PetChecklistDto[]> {
    const data = await this.petChecklistRepository.findCheckList(
      category,
      type,
      petId,
    );

    return data.map((checklist) => {
      const dto = Builder<PetChecklistDto>()
        .petChecklistId(checklist.petChecklistId)
        .petChecklistType(checklist.petChecklistType)
        .petChecklistCategory(checklist.petChecklistCategory)
        .petChecklistContent(checklist.petChecklistContent)
        .petChecklistChoices(
          checklist?.petChecklistChoices?.map((choice) => {
            return Builder<PetChecklistChoiceDto>()
              .petChecklistChoiceId(choice.petChecklistChoiceId)
              .petChecklistChoiceContent(choice.petChecklistChoiceContent)
              .checked(!!choice?.petChecklistChoiceAnswers)
              .build();
          }),
        )
        .petChecklistAnswer(
          checklist.petChecklistAnswers
            ? checklist?.petChecklistAnswers[0]?.petChecklistAnswer
            : null,
        )
        .build();

      if (dto.petChecklistType === ChecklistType.ANSWER) {
        dto.petChecklistChoices = null;
      } else {
        dto.petChecklistAnswer = null;
      }

      return dto;
    });
  }

  async answerChecklist(
    petId: number,
    dto: PetChecklistAnswerDto[],
    customer: ICustomer,
  ) {
    const pet = await this.getOne(petId, customer);

    const checklists = await this.petChecklistRepository.findByIds(
      dto.map((v) => v.petChecklistId),
    );

    for (const checklist of checklists) {
      const answer = dto.find(
        (d) => d.petChecklistId === checklist.petChecklistId,
      );

      if (checklist.petChecklistType === ChecklistType.ANSWER) {
        if (!answer?.petChecklistAnswer) {
          throw new BadRequestException('답변을 적어주세요');
        }
        await this.petChecklistAnswerRepository.create(
          Builder(PetChecklistAnswer)
            .petId(pet.petId)
            .petChecklistId(checklist.petChecklistId)
            .petChecklistAnswer(answer.petChecklistAnswer)
            .build(),
        );
      } else {
        if (!answer?.petChecklistChoiceId) {
          throw new BadRequestException('선택지를 선택해주세요');
        }

        const petChecklistChoiceAnswer = Builder(PetChecklistChoiceAnswer)
          .petId(pet.petId)
          .petChecklistId(checklist.petChecklistId)
          .petChecklistChoiceId(answer.petChecklistChoiceId)
          .build();

        if (answer.checked) {
          await this.petChecklistChoiceAnswerRepository.create(
            petChecklistChoiceAnswer,
          );
          return;
        }

        await this.petChecklistChoiceAnswerRepository.delete(
          petChecklistChoiceAnswer,
        );
      }
    }
  }
}
