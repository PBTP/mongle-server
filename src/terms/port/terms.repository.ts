import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TermEntity } from '../../schemas/terms.entity';

export const TERM_REPOSITORY = Symbol('TermRepository');

export interface ITermRepository {
  create(term: TermEntity): TermEntity;
  save(term: TermEntity): Promise<TermEntity>;
  getOne(termId: number): Promise<TermEntity>;
  findOne(termId: number): Promise<TermEntity | null>;
  findAll(): Promise<TermEntity[]>;
  findPendingTerms(customerId: number): Promise<TermEntity[]>; // 동의가 필요한 약관 (1 & 2)
  findPendingMandatoryTerms(customerId: number): Promise<TermEntity[]>; // 동의가 필요한 약관 (1 & 2) - 필수
  findPendingOptionalTerms(customerId: number): Promise<TermEntity[]>; // 동의가 필요한 약관 (1 & 2) - 선택
  findUnAgreedTerms(customerId: number): Promise<TermEntity[]>; // (1) 고객이 미동의한 약관
  findOutdatedTerms(customerId: number): Promise<TermEntity[]>; // (2) 갱신된 고객 동의 약관
}
@Injectable()
export class TermRepository implements ITermRepository {
  constructor(
    @InjectRepository(TermEntity)
    private readonly termDB: Repository<TermEntity>,
  ) {}

  create(term: TermEntity): TermEntity {
    return this.termDB.create(term);
  }

  async save(term: TermEntity): Promise<TermEntity> {
    return await this.termDB.save(term);
  }

  async getOne(termId: number): Promise<TermEntity> {
    if (!termId) throw new BadRequestException('약관 ID가 필요합니다.');
    return await this.termDB.findOneOrFail({ where: { termId } });
  }

  async findOne(termId: number): Promise<TermEntity | null> {
    if (!termId) throw new BadRequestException('약관 ID가 필요합니다.');
    return this.termDB.findOne({ where: { termId } });
  }

  async findAll(): Promise<TermEntity[]> {
    return this.termDB.find({
      order: {
        isMandatory: 'DESC',
        termId: 'ASC',
      },
    });
  }

  async findPendingTerms(customerId: number): Promise<TermEntity[]> {
    return this.termDB
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
  }

  async findPendingMandatoryTerms(customerId: number): Promise<TermEntity[]> {
    return this.termDB
      .createQueryBuilder('t')
      .leftJoin(
        'customer_terms',
        'ct',
        't.termId = ct.term_id AND ct.customer_id = :customerId AND t.isMandatory = true',
        { customerId },
      )
      .where('ct.term_id IS NULL') // 미동의 약관
      .orWhere('ct.version != t.version') // 갱신된 약관
      .getMany();
  }

  async findPendingOptionalTerms(customerId: number): Promise<TermEntity[]> {
    return this.termDB
      .createQueryBuilder('t')
      .leftJoin(
        'customer_terms',
        'ct',
        't.termId = ct.term_id AND ct.customer_id = :customerId AND t.isMandatory = false',
        { customerId },
      )
      .where('ct.term_id IS NULL') // 미동의 약관
      .orWhere('ct.version != t.version') // 갱신된 약관
      .getMany();
  }

  findUnAgreedTerms(customerId: number): Promise<TermEntity[]> {
    return this.termDB
      .createQueryBuilder('t')
      .leftJoinAndSelect(
        't.customer_terms',
        'ct',
        'ct.customer.customerId = :customerId',
        { customerId },
      )
      .where('ct.term IS NULL')
      .getMany();
  }

  async findOutdatedTerms(customerId: number): Promise<TermEntity[]> {
    return this.termDB
      .createQueryBuilder('t')
      .innerJoin('t.customerTerms', 'ct', 'ct.customerId = :customerId', {
        customerId,
      })
      .where('ct.version != t.version')
      .getMany();
  }
}
