import { Builder } from 'builder-pattern';
import { TermDto } from '../../../src/terms/presentation/terms.dto';
import { TermCategory, TermEntity } from '../../../src/schemas/terms.entity';
import { Term } from '../../../src/terms/terms.domain';

describe('Term Domain', () => {
    describe('from', () => {
        test('TermEntity로부터 Term 객체를 생성한다', () => {
            const termEntity: TermEntity = Builder<TermEntity>()
                .termId(1)
                .version(2)
                .title('이용약관 A')
                .description('A 이용에 대한 동의가 필요합니다.')
                .isMandatory(true)
                .termCategory(TermCategory.SERVICE)
                .build();

            const term: Term = Term.from(termEntity);

            expect(term).toBeDefined();
            expect(term.termId).toBe(1);
            expect(term.version).toBe(2);
            expect(term.title).toBe('이용약관 A');
            expect(term.description).toBe('A 이용에 대한 동의가 필요합니다.');
            expect(term.isMandatory).toBe(true);
            expect(term.termCategory).toBe(TermCategory.SERVICE);
        });
    });

    describe('toDto', () => {
        test('Term 객체를 TermDto로 변환한다', () => {
            const term = Builder<Term>()
                .termId(1)
                .version(2)
                .title('개인정보 수집 및 이용 동의')
                .description('개인정보 수집 동의 설명')
                .isMandatory(false)
                .termCategory(TermCategory.PRIVACY)
                .build();

            const dto: TermDto = TermDto.from(term);

            expect(dto).toBeDefined();
            expect(dto.termId).toBe(1);
            expect(dto.version).toBe(2);
            expect(dto.title).toBe('개인정보 수집 및 이용 동의');
            expect(dto.description).toBe('개인정보 수집 동의 설명');
            expect(dto.isMandatory).toBe(false);
            expect(dto.termCategory).toBe(TermCategory.PRIVACY);
        });
    });
});
