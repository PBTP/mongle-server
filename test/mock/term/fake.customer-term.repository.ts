
import { ICustomerTermRepository } from '../../../src/terms/port/customer-terms.repository';
import { CustomerTermEntity } from '../../../src/schemas/customer-terms.entity';
import { BadRequestException } from '@nestjs/common';

export class FakeCustomerTermRepository implements ICustomerTermRepository {
    private customerTerms: CustomerTermEntity[] = [];

    async create(entity: CustomerTermEntity): Promise<CustomerTermEntity> {
        this.customerTerms.push(entity);
        return entity;
    }

    async findByCustomerIdAndTermId(
        customerId: number,
        termId: number,
    ): Promise<CustomerTermEntity | null> {
        return (this.customerTerms.find((ct) => ct.customerId === customerId && ct.termId === termId,) || null);
    }

    async findByCustomer(customerId: number): Promise<CustomerTermEntity[]> {
        return this.customerTerms.filter((ct) => ct.customer?.customerId === customerId || ct.customerId === customerId,);
    }

    async deleteCustomerTerms(customerId: number): Promise<void> {
        this.customerTerms = this.customerTerms.filter((ct) => ct.customerId !== customerId);
    }

    async save(entity: CustomerTermEntity): Promise<CustomerTermEntity> {
        const i = this.customerTerms.findIndex((ct) => ct.termId === entity.termId && ct.customerId === entity.customerId);
        if (i === -1) { throw new BadRequestException('존재하지 않는 약관 동의입니다.'); }
        this.customerTerms[i] = entity;
        return entity;
    }

    async saveAll(entities: CustomerTermEntity[],): Promise<CustomerTermEntity[]> {
        return Promise.all(entities.map((entity) => this.save(entity)));
    }
}
