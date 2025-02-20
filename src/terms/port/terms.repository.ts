import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TermEntity } from '../../schemas/terms.entity';

export const TERM_REPOSITORY = Symbol('PetRepository');

export interface ITermRepository {
  getOne(termId: number): Promise<TermEntity>;
  findOne(termId: number): Promise<TermEntity | null>;
  findAll(): Promise<TermEntity[]>;
  // findAgreedTermsByCustomer(customerId: number): Promise<TermEntity[]>; // 고객이 동의한 약관
}
@Injectable()
export class TermRepository implements ITermRepository {
  constructor(
    @InjectRepository(TermEntity)
    private readonly termDB: Repository<TermEntity>,
  ) {}

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
}
