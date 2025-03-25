import { Customer } from "src/customer/customer.domain";
import { Term } from "./terms.domain";
import { CustomerTermEntity } from "src/schemas/customer-terms.entity";
import { Builder } from "builder-pattern";
import { DateHolder, IDateHolder } from "src/common/holder/date.holder";
import { CustomerEntity } from "src/schemas/customer.entity";
import { BadRequestException } from "@nestjs/common";
import { CustomerTermDto } from "./presentation/customer-terms.dto";
import { TermEntity } from "src/schemas/terms.entity";

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

    // Domain → DTO
    toDto(): CustomerTermDto {
        return Builder(CustomerTermDto)
            .version(this.version)
            .agreedAt(this.agreedAt)
            .customerId(this.customer.customerId ? this.customer.customerId : 0) // TODO: customerId 해결
            .termId(this.term.termId)
            .build();
    }

    static create(
        customer: Customer,
        term: Term,
        dateHolder: IDateHolder,
    ): CustomerTerm {
        if (!customer.customerId) {
            throw new BadRequestException('고객 ID가 누락되었습니다.');
        }

        return Builder(CustomerTerm)
            .version(term.version)
            .agreedAt(dateHolder.now())
            .customer(customer)
            .term(term)
            .build();
    }
}