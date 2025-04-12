import { BadRequestException } from '@nestjs/common/exceptions';
import { Breed } from "@pet/bred.domain";
import { BreedEntity } from "@schemas/breed.entity";
import { FakeUuidHolder } from '../fake.holder';
import { IBreedRepository } from "@pet/port/bree.repository";

export class FakeBreedRepository implements IBreedRepository {
  private breeds: BreedEntity[] = [];

  async create(breed: Breed, uuidHolder: FakeUuidHolder): Promise<BreedEntity> {
    const newBreed: BreedEntity = {
      ...breed,
      breedId: breed.breedId ?? this.breeds.length + 1,
      uuid: breed.uuid ?? uuidHolder.generatedUuid(),
      breedName: breed.breedName ?? '',
      breedDescription: breed.breedDescription ?? '',
      pets: [],
      generateUuid(): void {
        this.uuid = 'test-uuid';
      },
    };
    this.breeds.push(newBreed);
    return newBreed;
  }

  async getBreed(breedId: number): Promise<BreedEntity> {
    if (!breedId) {
      throw new BadRequestException('품종 ID가 필요합니다.');
    }
    const breedToGet = this.breeds.find((b) => b.breedId === breedId);
    if (!breedToGet) {
      throw new BadRequestException('존재하지 않는 품종입니다.');
    }
    return breedToGet;
  }
}
