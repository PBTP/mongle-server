import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TermEntity } from "@schemas/terms.entity";
import { Term } from '../terms.domain';

export const TERM_REPOSITORY = Symbol('TermRepository');

export interface ITermRepository {
  save(term: Term): Promise<Term>;
  getOne(termId: number): Promise<Term>;
  findOne(termId: number): Promise<Term | null>;
  findAll(): Promise<Term[]>;
  findPendingTerms(customerId: number): Promise<Term[]>; // 동의가 필요한 약관 (1 & 2)
  findUnAgreedTerms(customerId: number): Promise<Term[]>; // (1) 고객이 미동의한 약관
  findOutdatedTerms(customerId: number): Promise<Term[]>; // (2) 갱신된 고객 동의 약관
}

@Injectable()
export class TermRepository implements ITermRepository {
  constructor(
    @InjectRepository(TermEntity)
    private readonly termDB: Repository<TermEntity>,
  ) { }

  async save(term: Term): Promise<Term> {
    const entity = await this.termDB.save(term);
    return Term.from(entity);
  }

  async getOne(termId: number): Promise<Term> {
    if (!termId) throw new BadRequestException('약관 ID가 필요합니다.');
    const entity = await this.termDB.findOneOrFail({ where: { termId } });
    return Term.from(entity);
  }

  async findOne(termId: number): Promise<Term | null> {
    const entity = await this.termDB.findOne({ where: { termId } });
    if (!entity) return null;
    return Term.from(entity);
  }

  async findAll(): Promise<Term[]> {
    const entities = await this.termDB.find({
      order: { isMandatory: 'DESC' },
    });
    return entities.map(Term.from);
  }

  async findPendingTerms(customerId: number): Promise<Term[]> {
    const entities = await this.termDB
      .createQueryBuilder('t')
      .leftJoin(
        'customer_terms',
        'ct',
        't.termId = ct.term_id AND ct.customer_id = :customerId',
        { customerId },
      )
      .where('ct.term_id IS NULL') // 미동의 약관
      .orWhere('ct.version != t.version') // 갱신된 약관
      .getMany();
    return entities.map(Term.from);
  }

  async findUnAgreedTerms(customerId: number): Promise<Term[]> {
    const entities = await this.termDB
      .createQueryBuilder('t')
      .leftJoinAndSelect(
        't.customer_terms',
        'ct',
        'ct.customer.customerId = :customerId',
        { customerId },
      )
      .where('ct.term IS NULL')
      .getMany();
    return entities.map(Term.from);
  }

  async findOutdatedTerms(customerId: number): Promise<Term[]> {
    const entities = await this.termDB
      .createQueryBuilder('t')
      .innerJoin('t.customerTerms', 'ct', 'ct.customerId = :customerId', {
        customerId,
      })
      .where('ct.version != t.version')
      .getMany();
    return entities.map(Term.from);
  }
}
