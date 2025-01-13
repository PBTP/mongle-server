import { BadRequestException } from '@nestjs/common/exceptions';
import { IBreedRepository } from 'src/pet/port/bree.repository';
import { UUIDHolder } from '../../../src/common/holder/uuid.holders';
import { Breed } from '../../../src/pet/bred.domain';
import { BreedEntity } from '../../../src/schemas/breed.entity';
import { FakeUuidHolder } from '../fake.holder';

export class FakeBreedRepository implements IBreedRepository {
  private breeds: BreedEntity[] = [];

  constructor(
    initBreeds = [
      {
        breedId: 1,
        breedName: '몽글이',
        breedDescription: '귀엽다',
        pets: [],
      },
    ],
  ) {
    const uuidHolder = new FakeUuidHolder();
    this.breeds = initBreeds.map((breed) =>
      BreedEntity.create({ ...breed, breedId: breed.breedId }, uuidHolder),
    );
  }

  async create(breed: Breed, uuidHolder: UUIDHolder): Promise<BreedEntity> {
    const newBreed: BreedEntity = BreedEntity.create(breed, uuidHolder);
    this.breeds.push(newBreed);
    return newBreed;
  }

  async getBreed(breedId: number): Promise<BreedEntity> {
    if (!breedId) {
      throw new BadRequestException('품종 ID가 필요합니다.');
    }
    const breedToGet = this.breeds.find((b) => b.breedId === breedId);
    if (!breedToGet) {
      throw new Error('존재하지 않는 품종입니다.');
    }
    return breedToGet;
  }
}
