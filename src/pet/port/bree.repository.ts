import { BreedEntity } from "@schemas/breed.entity";
import { Breed } from '../bred.domain';
import { UUIDHolder } from "@common/holder/uuid.holders";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';

export const BREED_REPOSITORY = Symbol('BreedRepository');

export interface IBreedRepository {
  getBreed(breedId: number): Promise<BreedEntity>;
  create(dto: Breed, uuidHolder: UUIDHolder): Promise<BreedEntity>;
}

@Injectable()
export class BreedRepository implements IBreedRepository {
  constructor(
    @InjectRepository(BreedEntity)
    private readonly breedDB: Repository<BreedEntity>,
  ) {}

  async create(breed: Breed, uuidHolder: UUIDHolder): Promise<BreedEntity> {
    const breedEntity = this.breedDB.create(
      BreedEntity.create(breed, uuidHolder),
    );
    return await this.breedDB.save(breedEntity);
  }

  async getBreed(breedId: number): Promise<BreedEntity> {
    if (!breedId) {
      throw new BadRequestException('품종 ID가 필요합니다.');
    }
    return await this.breedDB.findOneOrFail({
      where: { breedId },
    });
  }
}
