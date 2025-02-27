import { BadRequestException } from '@nestjs/common/exceptions';
import { TermEntity } from '../../src/schemas/terms.entity';
import { ITermRepository } from '../../src/terms/port/terms.repository';

export class FakeTermRepository implements ITermRepository {
  private terms: TermEntity[] = [];

  create(term: TermEntity): TermEntity {
    const newTerm = new TermEntity();
    newTerm.termId = this.terms.length + 1;
    newTerm.version = term.version;
    newTerm.title = term.title;
    newTerm.description = term.description;
    newTerm.isMandatory = term.isMandatory;
    newTerm.termCategory = term.termCategory;
    newTerm.createdAt = new Date();
    newTerm.modifiedAt = new Date();
    this.terms.push(newTerm);
    return newTerm;
  }

  async save(term: TermEntity): Promise<TermEntity> {
    term.termId = this.terms.length + 1;
    this.terms.push(term);
    return term;
  }

  async getOne(termId: number): Promise<TermEntity> {
    if (!termId) throw new BadRequestException('약관 ID가 필요합니다.');
    const term = this.terms.find((t) => t.termId === termId);
    if (!term) throw new Error('존재하지 않는 약관입니다.');
    return term;
  }

  async findOne(termId: number): Promise<TermEntity | null> {
    return this.terms.find((t) => t.termId === termId) || null;
  }

  async findAll(): Promise<TermEntity[]> {
    return [...this.terms].sort((a, b) => (b.isMandatory ? -1 : 1));
  }

  async findPendingTerms(customerId: number): Promise<TermEntity[]> {
    return this.terms.filter((t) => !this.hasCustomerAgreed(customerId, t));
  }

  async findPendingMandatoryTerms(customerId: number): Promise<TermEntity[]> {
    return this.terms.filter(
      (t) => t.isMandatory && !this.hasCustomerAgreed(customerId, t),
    );
  }

  async findPendingOptionalTerms(customerId: number): Promise<TermEntity[]> {
    return this.terms.filter(
      (t) => !t.isMandatory && !this.hasCustomerAgreed(customerId, t),
    );
  }

  async findUnAgreedTerms(customerId: number): Promise<TermEntity[]> {
    return this.terms.filter((t) => !this.hasCustomerAgreed(customerId, t));
  }

  async findOutdatedTerms(customerId: number): Promise<TermEntity[]> {
    return this.terms.filter(
      (t) => this.hasCustomerAgreed(customerId, t) && this.isTermUpdated(t),
    );
  }

  private hasCustomerAgreed(customerId: number, term: TermEntity): boolean {
    return false;
  }

  private isTermUpdated(term: TermEntity): boolean {
    return term.version > 1; // 버전이 증가한 경우를 갱신된 약관으로 가정
  }
}
