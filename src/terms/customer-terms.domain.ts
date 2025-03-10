import { Customer } from "src/customer/customer.domain";
import { Term } from "./terms.domain";
import { CustomerTermEntity } from "src/schemas/customer-terms.entity";
import { Builder } from "builder-pattern";
import { CustomerTermDto } from "./presentation/customer-terms.dto";
import { DateHolder } from "src/common/holder/date.holder";
import { CustomerEntity } from "src/schemas/customer.entity";

export class CustomerTerm {
    version: number;
    agreedAt: Date;
    customer: Customer;
    term: Term;

    // Entity → Domain
    static from(entity: CustomerTermEntity): CustomerTerm {
        return Builder(CustomerTerm)
            .version(entity.version)
            .customer(entity.customer)
            .term(Term.from(entity.term))
            .build();
    }

    // Domain → Entity
    toEntity(): CustomerTermEntity {
        return Builder(CustomerTermEntity)
            .version(this.version)
            .agreedAt(this.agreedAt)
            .customer(CustomerEntity.from(this.customer))
            .term(this.term.to())
            .build();
    }

    // DTO → Domain
    static create(dto: CustomerTermDto, customer: Customer, term: Term, dateHolder: DateHolder): CustomerTerm {
        return Builder(CustomerTerm)
            .version(dto.version)
            .agreedAt(dto.agreedAt || dateHolder.now())
            .customer(customer)
            .term(term)
            .build();
    }

    // Domain → DTO
    toDto(): CustomerTermDto {
        return new CustomerTermDto(
            this.term.termId,
            this.customer.customerId ? this.customer.customerId : 0, // TODO: customerId undefined 처리
            this.version,
            this.agreedAt,

        );
    }

}