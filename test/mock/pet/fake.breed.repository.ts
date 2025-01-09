import {IBreedRepository} from "../../../src/pet/port/breed.repository";
import {Breed} from "../../../src/pet/bred.domain";
import {UUIDHolder} from "../../../src/common/holder/uuid.holders";
import {BreedEntity} from "../../../src/schemas/breed.entity";
import {BadRequestException} from "@nestjs/common/exceptions";

export class FakeBreedRepository implements  IBreedRepository {
    private readonly breeds: BreedEntity[] = [];

    async create(breed: Breed, uuidHolder: UUIDHolder): Promise<BreedEntity> {
         const newBreed:BreedEntity = BreedEntity.create(breed, uuidHolder);
         this.breeds.push(newBreed);
         return newBreed;
    }

    async getBreed(breedId: number): Promise<BreedEntity> {
        if (!breedId) {
            throw new BadRequestException('품종 ID가 필요합니다.');
        }
        const breedToGet = this.breeds.find((b) => b.breedId === breedId);
        if(!breedToGet){
            throw new Error('존재하지 않는 품종입니다.')
        }
        return breedToGet;
    }
}