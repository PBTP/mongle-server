import { DateHolder } from 'src/common/holder/date.holder';
import { UUIDHolder } from 'src/common/holder/uuid.holders';
import { Customer } from 'src/customer/customer.domain';
import { Pet } from 'src/pet/pet.domain';
import { IPetRepository } from '../../src/pet/port/pet.repository';
import { PetEntity } from '../../src/schemas/pets.entity';
import { CustomerEntity } from '../../src/schemas/customer.entity';

export class FakePetRepository implements IPetRepository {
  async create(
    dto: Pet,
    customer: Customer,
    dateHolder: DateHolder,
    uuidHolder: UUIDHolder,
  ): Promise<Pet> {
    return PetEntity.create(
      dto,
      CustomerEntity.from(customer),
      uuidHolder,
      dateHolder,
    );
  }
}
