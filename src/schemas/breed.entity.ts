import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Pet } from './pets.entity';
import { HasUuid } from '../common/entity/parent.entity';

export type TBreed = {
  breedId: number;
  breedName: string;
  breedDescription: string;
  pets: Pet[];
};

@Entity({ name: 'breed' })
export class Breed extends HasUuid implements TBreed {
  @PrimaryColumn()
  public breedId: number;

  @Column()
  public breedName: string;

  @Column()
  public breedDescription: string;

  @OneToMany(() => Pet, (pets) => pets.breed)
  public pets: Pet[];
}
