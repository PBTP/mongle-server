import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUrl, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "../../schemas/pets.entity";
import { ChecklistType, PetChecklistCategory } from "../../schemas/pet-checklist.entity";

export class PetDto {
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
  @IsNotEmpty()
  @Length(1, 30)
  public name: string;

  @ApiProperty({
    description: '반려동물의 성별',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  public gender: Gender;

  @ApiProperty({
    description: '반려동물의 생년월일',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  public birthdate: Date;

  @ApiProperty({
    description: '반려동물의 체중',
    required: true,
  })
  @IsNotEmpty()
  public weight: string;

  @ApiProperty({
    description: '중성화 여부',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  public neuteredYn: boolean;

  @ApiProperty({
    description: '반려동물의 성격',
    required: true,
  })
  @IsNotEmpty()
  public personality: string;

  @ApiProperty({
    description: '예방 접종 상태',
    required: true,
  })
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsNumber()
  public breedId: number;
}

export class PetChecklistDto {
  @ApiProperty({
    description: '반려동물 체크리스트 ID',
    required: false,
    readOnly: true,
  })
  @IsOptional()
  petChecklistId?: number;

  @ApiProperty({
    description: `체크리스트의 타입입니다. type은 총 choice와 answer가 있습니다.
    choice는 선택지가 있는 체크리스트이며, answer는 답변이 있는 체크리스트입니다`,
    required: false,
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

export class PetChecklistChoiceDto {
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
