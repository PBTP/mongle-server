import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../../schemas/pets.entity';
import { Breed } from '../../schemas/breed.entity';
import { Customer } from '../../schemas/customer.entity';
import { PetDto } from '../presentation/pet.dto';
import {
  ChecklistType,
  PetChecklist,
  PetChecklistCategory,
} from '../../schemas/pet-checklist.entity';

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
  ): Promise<PetChecklist[]> {
    return await this.petChecklistRepository.find({
      where: {
        petChecklistCategory: category,
        petChecklistType: type,
      },
    });
  }
}
