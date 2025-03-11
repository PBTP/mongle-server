import { Builder } from 'builder-pattern';
import { TermCategory, TermEntity } from 'src/schemas/terms.entity';
import { TermDto } from './presentation/terms.dto';

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
    toEntity(): TermEntity {
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
            .termId(this.termId)
            .version(this.version)
            .title(this.title)
            .description(this.description)
            .isMandatory(this.isMandatory)
            .termCategory(this.termCategory)
            .build();
    }

    //     if (!dto.termId || !dto.version || !dto.title || !dto.description || dto.isMandatory === undefined || !dto.termCategory) {
    //         throw new BadRequestException('필수 입력값이 누락되었습니다.');
    //     }
}
