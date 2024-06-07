import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Pet } from './pets.entity';

@Entity({ name: 'breed' })
export class Breed {
  @PrimaryColumn()
  public breedId: number;

  @Column({ unique: true, type: 'uuid' })
  public uuid: string;

  @Column()
  public breedName: string;

  @Column()
  public breedDescription: string;

  @OneToMany(() => Pet, (pets) => pets.breed)
  public pets: Pet[];
}
