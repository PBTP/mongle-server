import { BadRequestException } from '@nestjs/common/exceptions';
import { DateHolder } from 'src/common/holder/date.holder';
import { UUIDHolder } from 'src/common/holder/uuid.holders';
import { Customer } from 'src/customer/customer.domain';
import { Pet } from 'src/pet/pet.domain';
import { IPetRepository } from '../../../src/pet/port/pet.repository';
import { CustomerEntity } from '../../../src/schemas/customer.entity';
import { PetEntity } from '../../../src/schemas/pets.entity';

export class FakePetRepository implements IPetRepository {
  private pets: PetEntity[] = [];

  async getOne(petId: number): Promise<PetEntity> {
    const findPet = this.pets.find((p) => p.petId === petId);
    if (!findPet) {
      throw new Error('존재하지 않는 펫입니다.');
    }
    return findPet;
  }

  getOneById(petId: number): Promise<PetEntity> {
    const findPet = this.pets.find((p) => p.petId === petId);
    if (!findPet) {
      throw new Error('존재하지 않는 펫입니다.');
    }
    return Promise.resolve(findPet);
  }

  async findAllByCustomer(customer: Customer): Promise<PetEntity[]> {
    return this.pets.filter(
      (pet) => pet.customer.customerId === customer.customerId,
    );
  }

  async create(
    dto: Pet,
    customer: Customer,
    dateHolder: DateHolder,
    uuidHolder: UUIDHolder,
  ): Promise<Pet> {
    const entity = PetEntity.create(
      dto,
      CustomerEntity.from(customer),
      uuidHolder,
      dateHolder,
    );
    entity.petId = this.pets.length + 1;
    this.pets.push(entity);
    return entity;
  }

  async update(pet: Pet, dateHolder: DateHolder): Promise<Pet> {
    if (!pet.petId) {
      throw new BadRequestException('식별자가 없습니다.');
    }
    const findPet = this.pets.find((p) => p.petId === pet.petId);
    if (!findPet) {
      throw new Error('존재하지 않는 펫입니다.');
    }

    const updatedPet: PetEntity = PetEntity.update(pet, dateHolder);
    this.pets = this.pets.map((p) => (p.petId === pet.petId ? updatedPet : p));
    return updatedPet;
  }

  async delete(pet: Pet): Promise<PetEntity> {
    const findPet = this.pets.find((p) => p.petId === pet.petId);
    if (!pet.petId) {
      throw new BadRequestException('식별자가 없습니다.');
    }
    this.pets = this.pets.filter((p) => p.petId !== pet.petId);
    return PetEntity.from(pet);
  }
}
