import {Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import {PetEntity} from './pets.entity';
import {HasUuid} from '../common/entity/parent.entity';
import {Builder} from 'builder-pattern';
import {UUIDHolder} from '../common/holder/uuid.holders';
import {BadRequestException} from '@nestjs/common/exceptions';
import {Breed} from '../pet/bred.domain';

@Entity({ name: 'breed' })
export class BreedEntity extends HasUuid {
  @PrimaryColumn()
  public breedId: number;

  @Column()
  public breedName: string;

  @Column()
  public breedDescription: string;

  @OneToMany(() => PetEntity, (pets) => pets.breed)
  public pets: PetEntity[];

  public static from(entity: Breed): BreedEntity {
    return Builder(BreedEntity)
      .breedId(entity.breedId)
      .breedName(entity.breedName)
      .breedDescription(entity.breedDescription)
      .build();
  }

  public static create(breed: Breed, uuidHolder: UUIDHolder): BreedEntity {
    if (!breed.breedName || !breed.breedDescription) {
      throw new BadRequestException('필수 입력값이 누락되었습니다.');
    }

    return Builder(BreedEntity)
      .uuid(uuidHolder.generatedUuid())
      .breedName(breed.breedName)
      .breedDescription(breed.breedDescription)
      .build();
  }
}
