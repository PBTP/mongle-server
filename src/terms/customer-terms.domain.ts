import { Customer } from "src/customer/customer.domain";
import { Term } from "./terms.domain";
import { CustomerTermEntity } from "src/schemas/customer-terms.entity";
import { Builder } from "builder-pattern";
import { DateHolder, IDateHolder } from "src/common/holder/date.holder";
import { CustomerEntity } from "src/schemas/customer.entity";
import { BadRequestException } from "@nestjs/common";
import { CustomerTermDto } from "./presentation/customer-terms.dto";

export class CustomerTerm {
    version: number;
    agreedAt: Date;
    customer: Customer;
    term: Term;

    // Entity → Domain
    static from(entity: CustomerTermEntity): CustomerTerm {
        return Builder(CustomerTerm)
            .version(entity.version)
            .agreedAt(entity.agreedAt)
            .customer(entity.customer)
            .term(Term.from(entity.term))
            .build();
    }

    // Domain → Entity
    toEntity(): CustomerTermEntity {
        const entity = Builder(CustomerTermEntity)
            .customerId(this.customer.customerId ? this.customer.customerId : 0) // TODO: customerId undefined 해결
            .termId(this.term.termId)
            .version(this.version)
            .agreedAt(this.agreedAt)
            .customer(CustomerEntity.from(this.customer))
            .term(this.term.toEntity())
            .build();
        return entity;
    }

    // Domain → DTO
    toDto(): CustomerTermDto {
        return Builder(CustomerTermDto)
            .version(this.version)
            .agreedAt(this.agreedAt)
            .customerId(this.customer.customerId ? this.customer.customerId : 0) // TODO: customerId 해결
            .termId(this.term.termId)
            .build();
    }
}