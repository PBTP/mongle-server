import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Business } from "./business.entity";
import { Customer } from "./customer.entity";

//TODO: 추후 UUID -> TSID로 변경
@Entity({ name: 'favorites' })
export class Favorite {
  @Column({ primary: true, unique: true, type: 'uuid' })
  public uuid: string;

  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(() => Customer, (customers) => customers.favorites)
  @JoinColumn({ name: 'customer_id' })
  public customer: Customer;

  @ManyToOne(() => Business, (business) => business.favorites)
  @JoinColumn({ name: 'business_id' })
  public business: Business;
}
