import { PetService } from "../application/pet.service";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { PetChecklistDto, PetDto } from "./pet.dto";
import { Pet } from "../../schemas/pets.entity";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GroupValidation } from "src/common/validation/validation.decorator";
import { CrudGroup } from "src/common/validation/validation.data";
import { Customer } from "src/schemas/customer.entity";
// eslint-disable-next-line prettier/prettier
import { Auth, CurrentCustomer } from "src/auth/decorator/auth.decorator";
import { ChecklistType, PetChecklistCategory } from "../../schemas/pet-checklist.entity";

@ApiTags('반려동물 관련 API')
@Controller('/v1/pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get('/checklist')
  @Auth()
  async getChecklist(
    @Query('category') category: PetChecklistCategory,
    @Query('type') type: ChecklistType,
  ): Promise<PetChecklistDto[]> {
    return await this.petService.findCheckList(category, type, 1);
  }

  @ApiOperation({
    summary: '반려동물 정보 생성',
    description: '새로운 반려동물 정보를 생성합니다.',
  })
  @ApiOkResponse({ type: PetDto, description: '반려동물 정보 생성 성공' })
  @Post()
  @GroupValidation([CrudGroup.create])
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
  @GroupValidation([CrudGroup.read])
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
  @GroupValidation([CrudGroup.update])
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
  @GroupValidation([CrudGroup.delete])
  async delete(
    @Param('id') id: number,
    @CurrentCustomer() customer: Customer,
  ): Promise<void> {
    return await this.petService.delete(id, customer);
  }
}
