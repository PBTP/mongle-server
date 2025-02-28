import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth, CurrentCustomer } from '../../auth/decorator/auth.decorator';
import { ResponseEntity } from '../../common/dto/response.entity';
import { CrudGroup } from '../../common/validation/validation.data';
import { GroupValidation } from '../../common/validation/validation.decorator';
import { CustomerEntity } from '../../schemas/customer.entity';
import {
  ChecklistType,
  PetChecklistCategory,
} from '../../schemas/pet-checklist.entity';
import { PetEntity } from '../../schemas/pets.entity';
import { PetService } from '../application/pet.service';
import { Pet } from '../pet.domain';
import { PetChecklistAnswerDto, PetChecklistDto, PetDto } from './pet.dto';

@ApiTags('반려동물 관련 API')
@Controller('/v1/pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @ApiOkResponse({
    type: [PetChecklistDto],
  })
  @Get('/checklist')
  @Auth()
  async findChecklist(
    @Query('category') category: PetChecklistCategory,
    @Query('type') type: ChecklistType,
  ): Promise<PetChecklistDto[]> {
    return await this.petService.findCheckList(category, type, null);
  }

  @ApiOkResponse({
    type: [PetChecklistDto],
  })
  @Get('/:petId/checklist')
  @Auth()
  async findPetChecklist(
    @Param('petId') petId: number,
    @Query('category') category: PetChecklistCategory,
    @Query('type') type: ChecklistType,
  ): Promise<PetChecklistDto[]> {
    return await this.petService.findCheckList(category, type, petId);
  }

  @ApiOperation({
    summary: '반려동물 체크리스트 답변',
    description: '반려동물 체크리스트 답변을 등록합니다.',
  })
  @ApiOkResponse({
    type: [PetChecklistAnswerDto],
    description: '반려동물 체크리스트 답변 성공',
  })
  @ApiBody({ type: [PetChecklistAnswerDto] })
  @Post('/:petId/checklist/answer')
  @GroupValidation([CrudGroup.create])
  @Auth()
  async answerChecklist(
    @Param('petId') petId: number,
    @Body() dto: PetChecklistAnswerDto[],
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<PetChecklistAnswerDto[]> {
    return await this.petService
      .answerChecklist(petId, dto, customer)
      .then(() => dto);
  }

  @ApiOperation({
    summary: '반려동물 정보 생성',
    description: '새로운 반려동물 정보를 생성합니다.',
  })
  @ApiCreatedResponse({
    type: PetDto,
    description: '반려동물 정보 생성 성공',
  })
  @GroupValidation([CrudGroup.create])
  @Post()
  @Auth()
  async create(
    @Body() dto: PetDto,
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<Pet> {
    return await this.petService.create(dto, customer);
  }

  @ApiOperation({
    summary: '반려동물 정보 조회',
    description: '고객의 모든 반려동물 정보를 조회합니다.',
  })
  @Auth()
  @ApiOkResponse({
    type: PetDto,
    description: '반려동물 정보 조회 성공',
  })
  @Get('/my')
  async findAll(
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<PetEntity[]> {
    return await this.petService.findAll(customer);
  }

  @ApiOperation({
    summary: '반려동물 정보 조회',
    description: '반려동물 ID를 통해 반려동물 정보를 조회합니다.',
  })
  @ApiOkResponse({
    type: PetDto,
    description: '반려동물 정보 조회 성공',
  })
  @Get(':id')
  @GroupValidation([CrudGroup.read])
  async getOne(
    @Param('id') id: number,
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<PetEntity> {
    return await this.petService.getOne(id, customer);
  }

  @ApiOperation({
    summary: '반려동물 정보 수정',
    description: '반려동물 정보를 수정합니다.',
  })
  @ApiOkResponse({
    type: PetDto,
    description: '반려동물 정보 수정 성공',
  })
  @Put(':id')
  @GroupValidation([CrudGroup.update])
  async update(
    @Param('id') id: number,
    @Body() dto: Omit<PetDto, 'petId'>,
    @CurrentCustomer() customer: CustomerEntity,
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
    @CurrentCustomer() customer: CustomerEntity,
  ): Promise<ResponseEntity<void>> {
    return ResponseEntity.OK(await this.petService.delete(id, customer));
  }
}
