import { BadRequestException } from '@nestjs/common';
import { ITermRepository } from '../../../src/terms/port/terms.repository';
import { TermCategory, TermEntity } from '../../../src/schemas/terms.entity';

export class FakeTermRepository implements ITermRepository {
    private terms: TermEntity[] = [];
    private customerTermMap: Map<number, { termId: number; version: number }[]> = new Map();

    create(term: TermEntity): TermEntity {
        term.termId = this.terms.length + 1;
        this.terms.push(term);
        return term;
    }

    async save(term: TermEntity): Promise<TermEntity> {
        const i = this.terms.findIndex((t) => t.termId === term.termId);
        if (i >= 0) {
            this.terms[i] = term;
        } else {
            term.termId = this.terms.length + 1;
            this.terms.push(term);
        }
        return term;
    }

    async getOne(termId: number): Promise<TermEntity> {
        if (!termId) throw new BadRequestException('약관 ID가 필요합니다.');
        const entity = this.terms.find((t) => t.termId === termId);
        if (!entity) throw new Error('존재하지 않는 약관입니다.');
        return entity;
    }

    async findOne(termId: number): Promise<TermEntity | null> {
        if (!termId) throw new BadRequestException('약관 ID가 필요합니다.');
        return this.terms.find((t) => t.termId === termId) || null;
    }

    async findAll(): Promise<TermEntity[]> {
        return this.terms.sort((a, b) => Number(b.isMandatory) - Number(a.isMandatory)); // 필수 약관 먼저
    }

    async findPendingTerms(customerId: number): Promise<TermEntity[]> {
        const agreedTerms = this.customerTermMap.get(customerId) || [];

        return this.terms.filter((term) => {
            const agreed = agreedTerms.find((t) => t.termId === term.termId);
            return !agreed || agreed.version !== term.version;
        });
    }

    async findUnAgreedTerms(customerId: number): Promise<TermEntity[]> {
        const agreedTerms = this.customerTermMap.get(customerId) || [];
        return this.terms.filter(
            (term) => !agreedTerms.some((a) => a.termId === term.termId),
        );
    }

    async findOutdatedTerms(customerId: number): Promise<TermEntity[]> {
        const agreedTerms = this.customerTermMap.get(customerId) || [];
        return this.terms.filter((term) => {
            const agreed = agreedTerms.find((a) => a.termId === term.termId);
            return agreed && agreed.version !== term.version;
        });
    }
}
