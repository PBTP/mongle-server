import { Builder } from 'builder-pattern';
import { BreedEntity } from "@schemas/breed.entity";

export class Breed {
  uuid: string;
  breedId: number;
  breedName: string;
  breedDescription: string;

  static from(entity: BreedEntity): Breed {
    return Builder(Breed)
      .breedId(entity.breedId)
      .breedName(entity.breedName)
      .breedDescription(entity.breedDescription)
      .build();
  }
}
