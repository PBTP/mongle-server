import {DateHolder} from 'src/common/holder/date.holder';
import {UUIDHolder} from 'src/common/holder/uuid.holders';
import {Customer} from 'src/customer/customer.domain';
import {Pet} from 'src/pet/pet.domain';
import {IPetRepository} from '../../../src/pet/port/pet.repository';
import {PetEntity} from '../../../src/schemas/pets.entity';
import {CustomerEntity} from '../../../src/schemas/customer.entity';
import {BadRequestException} from "@nestjs/common/exceptions";

export class FakePetRepository implements IPetRepository {
  private pets: PetEntity[] = [];

  async getOne(petId:number): Promise<PetEntity> {
    const findPet = this.pets.find((p)=>p.petId === petId);
    if (!findPet) {
      throw new Error('존재하지 않는 펫입니다.')
    }
    return findPet;
  }

  findOneById(petId: number): Promise<PetEntity>{
    const findPet = this.pets.find((p)=>p.petId === petId);
    if (!findPet) {
      throw new Error('존재하지 않는 펫입니다.')
    }
    return Promise.resolve(findPet);
  }

  async findAllByCustomer(customer: Customer): Promise<PetEntity[]>{
    const findPets = this.pets.filter((pet)=>{
      return pet.customer===customer;
    });
    if(findPets.length===0) {
      throw new Error(`사용자(${customer.customerId})에게 등록된 펫이 없습니다.`);
    }
    return findPets;
  }

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

  async update(pet: Pet, dateHolder: DateHolder): Promise<Pet>{
    if (!pet.petId) {
      throw new BadRequestException('식별자가 없습니다.');
    }
    const findPet = this.pets.find((p) => p.petId === pet.petId);
    if (!findPet) {
      throw new Error('존재하지 않는 펫입니다.');
    }

    // todo: (단위테스트관련) 업데이트된 PetEntity 반환하는 아래 update 메소드 분리
    const updatedPet: PetEntity = PetEntity.update(pet, dateHolder);
    this.pets = this.pets.map((p)=> (p.petId === pet.petId ? updatedPet : p));
    return updatedPet;
  }

  async delete(pet: Pet): Promise<PetEntity>{
    const findPet = this.pets.find((p)=>p.petId === pet.petId);
    if (!pet.petId) {
      throw new BadRequestException('식별자가 없습니다.');
    }
    this.pets = this.pets.filter((p)=>p.petId!==pet.petId);
    // todo: (단위테스트관련) from 메소드 분리
    return PetEntity.from(pet);
  }

}
