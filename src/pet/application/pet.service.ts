import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Pet } from '../../schemas/pets.entity';
import { Breed } from '../../schemas/breed.entity';
import { Customer } from '../../schemas/customer.entity';
import {
  PetChecklistAnswerDto,
  PetChecklistChoiceDto,
  PetChecklistDto,
  PetDto,
} from '../presentation/pet.dto';
import {
  ChecklistType,
  PetChecklist,
  PetChecklistCategory,
} from '../../schemas/pet-checklist.entity';
import { PetChecklistChoice } from '../../schemas/pet-checklist-chocie.entity';
import { PetChecklistAnswer } from '../../schemas/pet-checklist-answer.entity';
import { PetChecklistChoiceAnswer } from '../../schemas/pet-checklist-chocie-answer.entity';
import { Builder } from 'builder-pattern';
import { CustomerService } from '../../customer/application/customer.service';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class PetService {
  constructor(
    private customerService: CustomerService,
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    @InjectRepository(PetChecklist)
    private petChecklistRepository: Repository<PetChecklist>,
    @InjectRepository(PetChecklistAnswer)
    private petChecklistAnswerRepository: Repository<PetChecklistAnswer>,
    @InjectRepository(PetChecklistChoiceAnswer)
    private petChecklistChoiceAnswerRepository: Repository<PetChecklistChoiceAnswer>,
    @InjectRepository(Breed)
    private breedRepository: Repository<Breed>,
  ) {}

  async create(dto: PetDto, customer: Customer): Promise<Pet> {
    const breed = await this.breedRepository.findOneOrFail({
      where: { breedId: dto.breedId },
    });

    if (!breed) {
      throw new NotFoundException('견종을 찾을 수 없습니다.');
    }

    const newPet = this.petRepository.create({
      ...dto,
      breed,
      customer,
    });

    return await this.petRepository.save(newPet);
  }

  async findAll(customer: Customer): Promise<Pet[]> {
    return await this.customerService.findOne(customer).then((v) => {
      return this.petRepository.find({
        where: {
          customer: {
            customerId: v.customerId,
          },
        },
        relations: ['breed'],
      });
    });
  }
  async findOne(id: number, customer: Customer): Promise<Pet> {
    const pet = await this.petRepository.findOneOrFail({
      where: { petId: id },
      relations: ['breed', 'customer'],
    });

    if (pet.customer.customerId !== customer.customerId) {
      throw new ForbiddenException('해당 반려동물에 접근할 수 없습니다.');
    }

    return pet;
  }

  async update(
    id: number,
    dto: Partial<PetDto>,
    customer: Customer,
  ): Promise<Pet> {
    const pet = await this.findOne(id, customer);

    if (dto.breedId && dto.breedId !== pet.breed.breedId) {
      pet.breed = await this.breedRepository.findOneOrFail({
        where: { breedId: dto.breedId },
      });
    }

    pet.petName = dto.petName ?? pet.petName;
    pet.petBirthdate = dto.petBirthdate ?? pet.petBirthdate;
    pet.petWeight = dto.petWeight ?? pet.petWeight;
    pet.neuteredYn = dto.neuteredYn ?? pet.neuteredYn;
    pet.personality = dto.personality ?? pet.personality;
    pet.vaccinationStatus = dto.vaccinationStatus ?? pet.vaccinationStatus;
    pet.petGender = dto.petGender ?? pet.petGender;

    return await this.petRepository.save(pet);
  }

  async delete(id: number, customer: Customer): Promise<void> {
    const pet = await this.findOne(id, customer);

    await this.petRepository.softDelete(pet.petId);
  }

  async findCheckList(
    category: PetChecklistCategory,
    type: ChecklistType,
    petId: number,
    customer: Customer,
  ): Promise<PetChecklistDto[]> {
    let query = this.petChecklistRepository
      .createQueryBuilder('PC')
      .leftJoinAndMapMany(
        'PC.petChecklistChoices',
        PetChecklistChoice,
        'PCC',
        'PC.pet_checklist_id = PCC.pet_checklist_id',
      );

    if (petId) {
      await this.findOne(petId, customer);

      query = query
        .leftJoinAndMapOne(
          'PCC.petChecklistChoiceAnswers',
          PetChecklistChoiceAnswer,
          'PCCA',
          `PCC.pet_checklist_id = PCCA.pet_checklist_id 
            AND PCC.pet_checklist_choice_id = PCCA.pet_checklist_choice_id 
            AND PCCA.pet_id = :petId`,
          { petId },
        )
        .leftJoinAndMapMany(
          'PC.petChecklistAnswers',
          PetChecklistAnswer,
          'PCA',
          'PC.pet_checklist_id = PCA.pet_checklist_id AND PCA.pet_id = :petId',
          { petId },
        );
    }

    type && query.andWhere('PC.pet_checklist_type = :type', { type });
    category &&
      query.andWhere('PC.pet_checklist_category = :category', { category });

    query.orderBy('PC.pet_checklist_id');

    const data = await query.getMany();
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
    customer: Customer,
  ) {
    const pet = await this.findOne(petId, customer);

    const checklist = await this.petChecklistRepository.find({
      where: {
        petChecklistId: In(dto.map((v) => v.petChecklistId)),
      },
    });

    for (const v of checklist) {
      const answer = dto.find((d) => d.petChecklistId === v.petChecklistId);

      if (v.petChecklistType === ChecklistType.ANSWER) {
        if (!answer.petChecklistAnswer) {
          throw new BadRequestException('답변을 적어주세요');
        }

        await this.petChecklistAnswerRepository.save({
          pet,
          petChecklistId: v.petChecklistId,
          petChecklistAnswer: answer.petChecklistAnswer,
        });
      } else {
        if (!answer.petChecklistChoiceId || answer.checked == undefined) {
          throw new BadRequestException('선택지를 선택해주세요');
        }

        if (answer.checked) {
          await this.petChecklistChoiceAnswerRepository.save({
            petId,
            petChecklistId: v.petChecklistId,
            petChecklistChoiceId: answer.petChecklistChoiceId,
          });
          return;
        }

        await this.petChecklistChoiceAnswerRepository.delete({
          petId,
          petChecklistId: v.petChecklistId,
          petChecklistChoiceId: answer.petChecklistChoiceId,
        });
      }
    }
  }
}
