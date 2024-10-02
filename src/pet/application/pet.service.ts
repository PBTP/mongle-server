import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pet } from "../../schemas/pets.entity";
import { Breed } from "../../schemas/breed.entity";
import { Customer } from "../../schemas/customer.entity";
import { PetChecklistChoiceDto, PetChecklistDto, PetDto } from "../presentation/pet.dto";
import { ChecklistType, PetChecklist, PetChecklistCategory } from "../../schemas/pet-checklist.entity";
import { PetChecklistChoice } from "../../schemas/pet-checklist-chocie.entity";
import { PetChecklistAnswer } from "../../schemas/pet-checklist-answer.entity";
import { PetChecklistChoiceAnswer } from "../../schemas/pet-checklist-chocie-answer.entity";
import { toDto } from "../../common/function/util.function";

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    @InjectRepository(PetChecklist)
    private petChecklistRepository: Repository<PetChecklist>,
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

    pet.name = dto.name ?? pet.name;
    pet.birthdate = dto.birthdate ?? pet.birthdate;
    pet.weight = dto.weight ?? pet.weight;
    pet.neuteredYn = dto.neuteredYn ?? pet.neuteredYn;
    pet.personality = dto.personality ?? pet.personality;
    pet.vaccinationStatus = dto.vaccinationStatus ?? pet.vaccinationStatus;
    pet.gender = dto.gender ?? pet.gender;

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
  ): Promise<PetChecklistDto[]> {
    // SELECT *
    // FROM pet_checklist PC
    // LEFT JOIN pet_checklist_answers PCA ON pc.pet_checklist_id = pca.pet_checklist_id
    // LEFT JOIN pet_checklist_choices PCC ON pc.pet_checklist_id = pcc.pet_checklist_id
    // LEFT JOIN pet_checklist_choices_answers  PCCA ON PC.pet_checklist_id = PCCA.pet_checklist_id
    //   AND PCC.pet_checklist_choice_id = PCCA.pet_checklist_choice_id
    // ORDER BY PC.pet_checklist_id, PCC.pet_checklist_choice_id

    let query = this.petChecklistRepository
      .createQueryBuilder('PC')
      .leftJoinAndMapMany(
        'PC.petCheckListChoices',
        PetChecklistChoice,
        'PCC',
        'PC.pet_checklist_id = PCC.pet_checklist_id',
      );

    if (petId) {
      query = query
        .leftJoinAndMapMany(
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

    const data = await query.getMany();
    return data.map((checklist) => {
      const dto = toDto(PetChecklistDto, checklist);

      dto.petChecklistChoices = checklist?.petChecklistChoices?.map(
        (choice) => {
          const choiceDto = toDto(PetChecklistChoiceDto, choice);
          choiceDto.checked = choice?.petChecklistChoiceAnswer?.length > 0;
          return choiceDto;
        },
      );

      return dto;
    });
  }
}
