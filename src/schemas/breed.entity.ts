import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Pet } from './pets.entity';
import { HasUuid } from '../common/entity/parent.entity';

@Entity({ name: 'breed' })
export class Breed extends HasUuid {
  @PrimaryColumn()
  public breedId: number;

  @Column()
  public breedName: string;

  @Column()
  public breedDescription: string;

  @OneToMany(() => Pet, (pets) => pets.breed)
  public pets: Pet[];
}
