import { Customer } from '../../customer/customer.domain';
import { Pet } from '../pet.domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetEntity } from '../../schemas/pets.entity';
import { Repository } from 'typeorm';
import { DateHolder } from '../../common/holder/date.holder';
import { UUIDHolder } from '../../common/holder/uuid.holders';
import { CustomerEntity } from '../../schemas/customer.entity';

export const PET_REPOSITORY = Symbol('PetRepository');

export interface IPetRepository {
  create(
    dto: Pet,
    customer: Customer,
    dateHolder: DateHolder,
    uuidHolder: UUIDHolder,
  ): Promise<Pet>;
}

@Injectable()
export class PetRepository implements IPetRepository {
  constructor(
    @InjectRepository(PetEntity)
    private readonly petDB: Repository<PetEntity>,
  ) {}

  async create(
    dto: Pet,
    customer: Customer,
    dateHolder: DateHolder,
    uuidHolder: UUIDHolder,
  ): Promise<Pet> {
    const entity = this.petDB.create(
      PetEntity.create(
        dto,
        CustomerEntity.from(customer),
        uuidHolder,
        dateHolder,
      ),
    );
    return Pet.from(await this.petDB.save(entity));
  }
}
