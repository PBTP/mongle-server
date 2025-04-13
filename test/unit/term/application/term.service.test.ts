import { TermService } from "@terms/application/terms.service";
import { FakeTermRepository } from "@mock/term/fake.term.repository";
import { FakeCustomerTermRepository } from "@mock/term/fake.customer-term.repository";
import { FakeDateHolder } from "@mock/fake.holder";
import { setupInitialTermData } from "@mock/term/term.setup-data";
import { CustomerTermDto } from "@terms/presentation/customer-terms.dto";
import { FakeCustomerRepository } from "@mock/fake.customer.repository";
import { CustomerEntity } from "@schemas/customer.entity";

describe('TermService', () => {

    let service: TermService;
    let fakeTermRepository: FakeTermRepository;
    let fakeCustomerTermRepository: FakeCustomerTermRepository;
    let fakeCustomerRepository: FakeCustomerRepository;
    let customer: CustomerEntity;
    let fakeDateHolder: FakeDateHolder;

    beforeEach(async () => {
        fakeTermRepository = new FakeTermRepository();
        fakeCustomerTermRepository = new FakeCustomerTermRepository();
        fakeCustomerRepository = new FakeCustomerRepository();
        fakeDateHolder = new FakeDateHolder(new Date());

        customer = await setupInitialTermData(
            fakeCustomerRepository,
            fakeTermRepository,
            fakeCustomerTermRepository,
        );

        service = new TermService(
            fakeTermRepository,
            fakeCustomerTermRepository,
            fakeDateHolder,
        );
    });

    describe('findAll', () => {
        it('전체 약관 목록을 조회한다', async () => {
            const terms = await service.findAll();
            expect(terms).toBeDefined();
            expect(terms.length).toBe(6);
        });
    });

    describe('findById', () => {
        it('특정 ID로 약관을 조회한다', async () => {
            const term = await service.findById(1);
            expect(term).toBeDefined();
            expect(term?.termId).toBe(1);
        });

        it('존재하지 않는 약관 조회 시 null을 반환한다', async () => {
            const term = await service.findById(999);
            expect(term).toBeNull();
        });
    });

    describe('saveCustomerTerm', () => {
        it('고객 단일 약관 동의 정보를 저장한다', async () => {
            const dto = createCustomerTermDto(3, 1);
            const saved = await service.saveCustomerTerm(dto, customer);
            expect(saved).toBeDefined();
            expect(saved.term.termId).toBe(3);
            expect(saved.version).toBe(1);
        });
    });

    describe('saveCustomerTerms', () => {
        it('고객 약관 동의 정보를 여러 개 저장한다', async () => {
            const dtos: CustomerTermDto[] = [
                createCustomerTermDto(4, 1),
                createCustomerTermDto(6, 1),
            ];
            const saved = await service.saveCustomerTerms(dtos, customer);
            expect(saved).toHaveLength(2);
            expect(saved[0].term.termId).toBe(4);
            expect(saved[1].term.termId).toBe(6);
        });
    });

    describe('findAgreedTerms', () => {
        it('고객이 동의한 약관 목록을 조회한다', async () => {
            const result = await service.findAgreedTerms(customer);
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('checkTerm', () => {
        it('고객이 최신 약관에 동의했다면 true를 반환한다', async () => {
            const result = await service.checkTerm(customer, 1); // 같은 버전 동의
            expect(result).toBe(true);
        });

        it('고객이 동의한 버전과 최신 약관 버전이 다른 경우 false를 반환한다', async () => {
            const result = await service.checkTerm(customer, 2); // 버전 불일치
            expect(result).toBe(false);
        });

        it('고객이 해당 약관에 대해 미동의했다면 false를 반환한다', async () => {
            const result = await service.checkTerm(customer, 3); // 미동의
            expect(result).toBe(false);
        });
    });

    describe('findPendingTerms', () => {
        it('고객의 동의가 필요한 전체 약관을 조회한다', async () => {
            const terms = await service.findPendingTerms(customer);
            expect(terms.length).toBe(4); // 미동의 2개 & 버전불일치 2개
        });
    });

    describe('findPendingMandatoryTerms', () => {
        it('고객의 동의가 필요한 필수 약관만 조회한다', async () => {
            const terms = await service.findPendingMandatoryTerms(customer);
            expect(terms.every((t) => t.isMandatory)).toBe(true);
        });
    });

    describe('findPendingOptionalTerms', () => {
        it('고객의 동의가 필요한 선택 약관만 조회한다', async () => {
            const terms = await service.findPendingOptionalTerms(customer);
            expect(terms.every((t) => !t.isMandatory)).toBe(true);
        });
    });

    describe('deleteCustomerTerms', () => {
        it('고객 탈퇴 시 해당 고객의 모든 약관 동의를 삭제한다', async () => {
            await service.deleteCustomerTerms(customer);
            const after = await service.findAgreedTerms(customer);
            expect(after.length).toBe(0);
        });
    });
});

function createCustomerTermDto(termId: number, customerId: number, version = 1): CustomerTermDto {
    return Object.assign(new CustomerTermDto(), {
        termId,
        customerId,
        version,
        agreedAt: new Date(),
    });
}
