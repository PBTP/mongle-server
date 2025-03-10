import { BadRequestException } from '@nestjs/common/exceptions';
import { Builder } from 'builder-pattern';
import { DateHolder } from '../common/holder/date.holder';
import { UUIDHolder } from '../common/holder/uuid.holders';
import { TermCategory, TermEntity } from 'src/schemas/terms.entity';
import { CreateTermDto, TermDto, UpdateTermDto } from './presentation/terms.dto';

export class Term {
    termId: number;
    version: number;
    title: string;
    description: string;
    isMandatory: boolean;
    termCategory: TermCategory;
    createdAt: Date;
    modifiedAt?: Date;
    deletedAt?: Date;

    // Entity → Domain
    static from(entity: TermEntity): Term {
        return Builder(Term)
            .termId(entity.termId)
            .version(entity.version)
            .title(entity.title)
            .description(entity.description)
            .isMandatory(entity.isMandatory)
            .termCategory(entity.termCategory)
            .createdAt(entity.createdAt)
            .modifiedAt(entity.modifiedAt)
            .deletedAt(entity.deletedAt)
            .build();
    }

    // Domain → Entity
    to(): TermEntity {
        return Builder(TermEntity)
            .termId(this.termId)
            .version(this.version)
            .title(this.title)
            .description(this.description)
            .isMandatory(this.isMandatory)
            .termCategory(this.termCategory)
            .createdAt(this.createdAt)
            .modifiedAt(this.modifiedAt)
            .deletedAt(this.deletedAt)
            .build();
    }

    // Domain → DTO
    toDto(): TermDto {
        return Builder(TermDto)
            .version(this.version)
            .title(this.title)
            .description(this.description)
            .isMandatory(this.isMandatory)
            .termCategory(this.termCategory)
            .build();
    }

    // CreateTermDTO → Domain
    static create(dto: CreateTermDto, uuidHolder: UUIDHolder, dateHolder: DateHolder): Term {
        if (!dto.version || !dto.title || !dto.description || dto.isMandatory === undefined || !dto.termCategory) {
            throw new BadRequestException('필수 입력값이 누락되었습니다.');
        }

        return Builder(Term)
            .version(dto.version)
            .title(dto.title)
            .description(dto.description)
            .isMandatory(dto.isMandatory)
            .termCategory(dto.termCategory)
            .createdAt(dateHolder.now())
            .modifiedAt(dateHolder.now())
            .build();
    }

    // UpdateTermDto → Domain
    static createFromUpdateDto(dto: UpdateTermDto, dateHolder: DateHolder): Term {
        if (!dto.termId || !dto.version || !dto.title || !dto.description || dto.isMandatory === undefined || !dto.termCategory) {
            throw new BadRequestException('필수 입력값이 누락되었습니다.');
        }

        return Builder(Term)
            .termId(dto.termId)
            .version(dto.version)
            .title(dto.title)
            .description(dto.description)
            .isMandatory(dto.isMandatory)
            .termCategory(dto.termCategory)
            .modifiedAt(dateHolder.now())
            .build();
    }

    // Domain → UpdateTermDto
    toUpdateDto(): UpdateTermDto {
        return Builder(UpdateTermDto)
            .termId(this.termId)
            .version(this.version)
            .title(this.title)
            .description(this.description)
            .isMandatory(this.isMandatory)
            .termCategory(this.termCategory)
            .build();
    }
}
