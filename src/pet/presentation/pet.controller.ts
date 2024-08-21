import { PetService } from '../application/pet.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { PetDto } from './pet.dto';
import { Pet } from '../../schemas/pets.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupValidation } from 'src/common/validation/validation.decorator';
import { Group } from 'src/common/validation/validation.data';
import { Customer } from 'src/schemas/customers.entity';
import { CurrentCustomer } from 'src/auth/decorator/auth.decorator';

@ApiTags('반려동물 관련 API')
@Controller('/v1/pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @ApiOperation({
    summary: '반려동물 정보 생성',
    description: '새로운 반려동물 정보를 생성합니다.',
  })
  @ApiOkResponse({ type: PetDto, description: '반려동물 정보 생성 성공' })
  @Post()
  @GroupValidation([Group.create])
  async create(
    @Body() dto: PetDto,
    @CurrentCustomer() customer: Customer,
  ): Promise<Pet> {
    return await this.petService.create(dto, customer);
  }

  @ApiOperation({
    summary: '반려동물 정보 조회',
    description: '반려동물 ID를 통해 반려동물 정보를 조회합니다.',
  })
  @ApiOkResponse({ type: PetDto, description: '반려동물 정보 조회 성공' })
  @Get(':id')
  @GroupValidation([Group.read])
  async getOne(
    @Param('id') id: number,
    @CurrentCustomer() customer: Customer,
  ): Promise<Pet> {
    return await this.petService.findOne(id, customer);
  }

  @ApiOperation({
    summary: '반려동물 정보 수정',
    description: '반려동물 정보를 수정합니다.',
  })
  @ApiOkResponse({ type: PetDto, description: '반려동물 정보 수정 성공' })
  @Put(':id')
  @GroupValidation([Group.update])
  async update(
    @Param('id') id: number,
    @Body() dto: Omit<PetDto, 'petId'>,
    @CurrentCustomer() customer: Customer,
  ): Promise<Pet> {
    return await this.petService.update(id, dto, customer);
  }

  @ApiOperation({
    summary: '반려동물 정보 삭제',
    description: '반려동물 정보를 삭제합니다.',
  })
  @ApiOkResponse({ description: '반려동물 정보 삭제 성공' })
  @Delete(':id')
  @GroupValidation([Group.delete])
  async delete(
    @Param('id') id: number,
    @CurrentCustomer() customer: Customer,
  ): Promise<void> {
    return await this.petService.delete(id, customer);
  }
}
