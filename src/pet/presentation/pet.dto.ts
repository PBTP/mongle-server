import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  Length,
  IsDate,
  IsBoolean,
  IsUrl,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../schemas/pets.entity';

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
