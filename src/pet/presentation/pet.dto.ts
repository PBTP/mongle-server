import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  Length,
  ValidateIf
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../schemas/pets.entity';
import { ChecklistType, PetChecklistCategory } from '../../schemas/pet-checklist.entity';
import { CrudGroup } from '../../common/validation/validation.data';

export type TPetDto = {
  petId?: number;
  petName: string;
  petGender: Gender;
  petBirthdate: Date;
  petWeight: number;
  neuteredYn: boolean;
  personality: string;
  vaccinationStatus: string;
  photoUrl?: string;
  breedId: number;
};

export class PetDto implements TPetDto {
  @ApiProperty({
    description: '반려동물의 고유 ID',
    required: false,
    readOnly: true,
  })
  @IsOptional()
  public petId?: number;

  @ApiProperty({
    description: '반려동물 이름',
    required: true,
  })
  @IsNotEmpty({
    groups: [CrudGroup.create],
  })
  @Length(1, 30, {
    groups: [CrudGroup.create],
  })
  public petName: string;

  @ApiProperty({
    description: '반려동물의 성별',
    required: true,
  })
  @IsNotEmpty({
    groups: [CrudGroup.create],
  })
  @IsEnum(Gender, {
    groups: [CrudGroup.create],
  })
  public petGender: Gender;

  @ApiProperty({
    description: '반려동물의 생년월일',
    required: true,
  })
  @IsNotEmpty({
    groups: [CrudGroup.create],
  })
  @IsDate({
    groups: [CrudGroup.create],
  })
  public petBirthdate: Date;

  @ApiProperty({
    description: '반려동물의 체중',
    required: true,
  })
  @IsNotEmpty({
    groups: [CrudGroup.create],
  })
  public petWeight: number;

  @ApiProperty({
    description: '중성화 여부',
    required: true,
  })
  @IsNotEmpty({
    groups: [CrudGroup.create],
  })
  @IsBoolean({
    groups: [CrudGroup.create],
  })
  public neuteredYn: boolean;

  @ApiProperty({
    description: '반려동물의 특성',
    required: true,
  })
  public personality: string;

  @ApiProperty({
    description: '예방 접종 상태',
    required: true,
  })
  @IsNotEmpty({
    groups: [CrudGroup.create],
  })
  public vaccinationStatus: string;

  @ApiProperty({
    description: '반려동물 사진 URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public photoUrl?: string;

  @ApiProperty({
    description: '견종 ID',
    required: true,
  })
  @IsNotEmpty({
    groups: [CrudGroup.create],
  })
  @IsNumber()
  public breedId: number;
}

export type TPetChecklistDto = {
  petChecklistId?: number;
  petChecklistType: ChecklistType;
  petChecklistCategory: PetChecklistCategory;
  petChecklistContent: string;
  petChecklistChoices?: PetChecklistChoiceDto[];
  petChecklistAnswer?: string;
};

export class PetChecklistDto implements TPetChecklistDto {
  @ApiProperty({
    description: '반려동물 체크리스트 ID',
    required: false,
    readOnly: true,
  })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty({
    groups: [CrudGroup.create],
  })
  petChecklistId?: number;

  @ApiProperty({
    description: `체크리스트의 타입입니다. type은 총 choice와 answer가 있습니다.
    choice는 선택지가 있는 체크리스트이며, answer는 답변이 있는 체크리스트입니다`,
    required: false,
    readOnly: true,
  })
  petChecklistType: ChecklistType;

  @ApiProperty({
    description: '체크리스트 카테고리입니다.',
    required: true,
  })
  petChecklistCategory: PetChecklistCategory;

  @ApiProperty({
    description: '체크리스트 내용입니다.',
    required: false,
  })
  petChecklistContent: string;

  @ApiProperty({
    description: '체크리스트 선택지입니다.',
    required: false,
  })
  petChecklistChoices: PetChecklistChoiceDto[];

  @ApiProperty({
    description: '체크리스트 답변입니다.',
    required: false,
  })
  petChecklistAnswer: string;
}

export type TPetChecklistAnswerDto = {
  petChecklistId: number;
  petChecklistChoiceId: number;
  checked: boolean;
  petChecklistAnswer: string;
};

export class PetChecklistAnswerDto implements TPetChecklistAnswerDto {
  @ApiProperty({
    description: '반려동물 체크리스트 ID',
    required: true,
  })
  @IsNotEmpty()
  petChecklistId: number;

  @ApiProperty({
    description:
      '반려동물 체크리스트 선택지 ID\n' +
      '선택지가 없는 체크리스트의 경우 nullable합니다.',
    required: true,
  })
  @ValidateIf((o) => o.petChecklistAnswer === null)
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  petChecklistChoiceId: number;

  @ApiProperty({
    description:
      '반려동물 체크리스트 선택유무' +
      '선택지가 없는 체크리스트의 경우 nullable합니다.',
    required: true,
  })
  @ValidateIf((o) => o.petChecklistAnswer === null)
  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  checked: boolean;

  @ApiProperty({
    description:
      '반려동물 체크리스트 답변입니다.\n' +
      '선택지가 있는 체크리스트의 경우 nullable합니다.',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  @ValidateIf((o) => o.petChecklistChoiceId === null)
  petChecklistAnswer: string;
}

export type TPetChecklistChoiceDto = {
  petChecklistChoiceId?: number;
  petChecklistChoiceContent: string;
  checked: boolean;
};

export class PetChecklistChoiceDto implements TPetChecklistChoiceDto {
  @ApiProperty({
    description: '체크리스트 선택지 ID',
    required: false,
    readOnly: true,
  })
  @IsOptional()
  petChecklistChoiceId?: number;

  @ApiProperty({
    description: '체크리스트 선택지 내용입니다.',
    required: true,
  })
  @IsNotEmpty()
  petChecklistChoiceContent: string;

  @ApiProperty({
    readOnly: true,
    required: false,
    description: '해당 선택지가 선택되었는지에 대한 유무입니다.',
  })
  checked: boolean = false;
}
