import { BadRequestException } from '@nestjs/common';
import { ITermRepository } from '../../../src/terms/port/terms.repository';
import { TermEntity } from '../../../src/schemas/terms.entity';
import { CustomerTermEntity } from '../../../src/schemas/customer-terms.entity';
import { Term } from '../../../src/terms/terms.domain';
import { CustomerTerm } from '../../../src/terms/customer-terms.domain';

export class FakeTermRepository implements ITermRepository {
    private terms: TermEntity[] = [];
    private customerTerms: CustomerTermEntity[] = [];

    async save(term: Term): Promise<Term> {
        const i = this.terms.findIndex((t) => t.termId === term.termId);
        if (i >= 0) {
            this.terms[i] = TermEntity.from(term);
        } else {
            term.termId = this.terms.length + 1;
            this.terms.push(TermEntity.from(term));
        }
        return term;
    }

    async getOne(termId: number): Promise<Term> {
        if (!termId) throw new BadRequestException('약관 ID가 필요합니다.');
        const entity = this.terms.find((t) => t.termId === termId);
        if (!entity) throw new Error('존재하지 않는 약관입니다.');
        return Term.from(entity);
    }

    async findOne(termId: number): Promise<Term | null> {
        if (!termId) throw new BadRequestException('약관 ID가 필요합니다.');
        const entity = this.terms.find((t) => t.termId === termId);
        return entity ? Term.from(entity) : null;
    }

    async findAll(): Promise<Term[]> {
        return this.terms
            .sort((a, b) => Number(b.isMandatory) - Number(a.isMandatory))
            .map(Term.from);
    }

    async findPendingTerms(customerId: number): Promise<Term[]> {
        return this.terms
            .filter((term) => {
                const matched = this.customerTerms.find(
                    (ct) => ct.customerId === customerId && ct.termId === term.termId,
                );
                return !matched || matched.version !== term.version;
            })
            .map(Term.from);
    }

    async findUnAgreedTerms(customerId: number): Promise<Term[]> {
        return this.terms
            .filter(
                (term) =>
                    !this.customerTerms.some(
                        (ct) => ct.customerId === customerId && ct.termId === term.termId,
                    ),
            )
            .map(Term.from);
    }

    async findOutdatedTerms(customerId: number): Promise<Term[]> {
        return this.terms
            .filter((term) => {
                const matched = this.customerTerms.find(
                    (ct) => ct.customerId === customerId && ct.termId === term.termId,
                );
                return matched && matched.version !== term.version;
            })
            .map(Term.from);
    }

    syncCustomerTerms(customerTerms: CustomerTerm[]) {
        this.customerTerms = customerTerms.map(CustomerTermEntity.from);
    }
}
