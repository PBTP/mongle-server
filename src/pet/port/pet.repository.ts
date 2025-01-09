import {Customer} from '../../customer/customer.domain';
import {Pet} from '../pet.domain';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {PetEntity} from '../../schemas/pets.entity';
import {Repository} from 'typeorm';
import {DateHolder} from '../../common/holder/date.holder';
import {UUIDHolder} from '../../common/holder/uuid.holders';
import {CustomerEntity} from '../../schemas/customer.entity';
import {BadRequestException} from '@nestjs/common/exceptions';

export const PET_REPOSITORY = Symbol('PetRepository');

export interface IPetRepository {
  getOne(petId: number): Promise<PetEntity>;
  findOneById(petId: number): Promise<PetEntity>;
  findAllByCustomer(customer: Customer): Promise<PetEntity[]>;
  create(
    dto: Pet,
    customer: Customer,
    dateHolder: DateHolder,
    uuidHolder: UUIDHolder,
  ): Promise<Pet>;
  update(pet: Pet, dateHolder: DateHolder): Promise<Pet>;
  delete(pet: Pet): Promise<PetEntity>;
}

@Injectable()
export class PetRepository implements IPetRepository {
  constructor(
    @InjectRepository(PetEntity)
    private readonly petDB: Repository<PetEntity>,
  ) {}

  async getOne(petId: number): Promise<PetEntity> {
    return await this.petDB.findOneOrFail({
      where: { petId },
      relations: ['breed', 'customer'],
    });
  }

  findOneById(petId: number): Promise<PetEntity> {
    return this.petDB.findOneOrFail({
      where: { petId },
      relations: ['breed', 'customer'],
    });
  }

  async findAllByCustomer(customer: Customer): Promise<PetEntity[]> {
    return await this.petDB.find({
      where: { customer: CustomerEntity.from(customer) },
      relations: ['breed'],
    });
  }

  async create(
    dto: Pet,
    customer: Customer,
    dateHolder: DateHolder,
    uuidHolder: UUIDHolder,
  ): Promise<PetEntity> {
    const entity = this.petDB.create(
      PetEntity.create(
        dto,
        CustomerEntity.from(customer),
        uuidHolder,
        dateHolder,
      ),
    );

    return await this.petDB.save(entity);
  }

  async update(pet: Pet, dateHolder: DateHolder): Promise<PetEntity> {
    await this.petDB.findOneOrFail({
      where: { petId: pet.petId },
    });

    return await this.petDB.save(PetEntity.update(pet, dateHolder));
  }

  async delete(pet: Pet): Promise<PetEntity> {
    if (!pet.petId) {
      throw new BadRequestException('식별자가 없습니다.');
    }
    await this.petDB.softDelete(pet.petId);
    return PetEntity.from(pet);
  }
}
