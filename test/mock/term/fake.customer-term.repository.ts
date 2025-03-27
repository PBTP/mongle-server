
import { ICustomerTermRepository } from '../../../src/terms/port/customer-terms.repository';
import { CustomerTermEntity } from '../../../src/schemas/customer-terms.entity';
import { CustomerTerm } from '../../../src/terms/customer-terms.domain';

export class FakeCustomerTermRepository implements ICustomerTermRepository {
    private customerTerms: CustomerTermEntity[] = [];

    async findByCustomerIdAndTermId(
        customerId: number,
        termId: number,
    ): Promise<CustomerTerm | null> {
        const entity = (this.customerTerms.find((ct) => ct.customerId === customerId && ct.termId === termId) || null);
        return entity ? CustomerTerm.from(entity) : null;
    }

    async findByCustomer(customerId: number): Promise<CustomerTerm[]> {
        const entities = this.customerTerms.filter((ct) => ct.customer?.customerId === customerId || ct.customerId === customerId);
        return entities.map(CustomerTerm.from);
    }

    async deleteCustomerTerms(customerId: number): Promise<void> {
        this.customerTerms = this.customerTerms.filter(
            (ct) => ct.customerId !== customerId,
        );
    }

    async save(domain: CustomerTerm): Promise<CustomerTerm> {
        const i = this.customerTerms.findIndex(
            (ct) => ct.termId === domain.term.termId && ct.customerId === domain.customer.customerId,
        );
        if (i === -1) {
            this.customerTerms.push(CustomerTermEntity.from(domain));
        } else {
            this.customerTerms[i] = CustomerTermEntity.from(domain);
        }
        return domain;
    }

    async saveAll(
        entities: CustomerTerm[],
    ): Promise<CustomerTerm[]> {
        return Promise.all(entities.map((entity) => this.save(entity)));
    }

    getAll(): CustomerTerm[] {
        return this.customerTerms.map(CustomerTerm.from);
    }
}
