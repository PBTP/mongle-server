import { TermController } from '../../../../src/terms/presentation/terms.controller';
import { TermService } from '../../../../src/terms/application/terms.service';
import { FakeTermRepository } from '../../../mock/term/fake.term.repository';
import { FakeCustomerTermRepository } from '../../../mock/term/fake.customer-term.repository';
import { FakeCustomerRepository } from '../../../mock/fake.customer.repository';
import { FakeDateHolder } from '../../../mock/fake.holder';
import { setupInitialTermData } from '../../../mock/term/term.setup-data';
import { CustomerEntity } from '../../../../src/schemas/customer.entity';
import { CustomerTermDto } from '../../../../src/terms/presentation/customer-terms.dto';


describe('TermController', () => {
    let controller: TermController;
    let service: TermService;
    let fakeTermRepository: FakeTermRepository;
    let fakeCustomerTermRepository: FakeCustomerTermRepository;
    let fakeCustomerRepository: FakeCustomerRepository;
    let fakeDateHolder: FakeDateHolder;
    let customer: CustomerEntity;

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

        controller = new TermController(service);
    });

    it('전체 약관 목록을 조회한다', async () => {
        const result = await controller.findAllTerms();
        expect(result.data!).toHaveLength(6);
    });

    it('특정 ID로 약관을 조회한다', async () => {
        const result = await controller.findTermsById(1);
        expect(result.data!.termId).toBe(1);
    });

    it('존재하지 약관 조회 시 null을 반환한다', async () => {
        const result = await controller.findTermsById(999);
        expect(result.data!).toBeNull();
    });

    it('고객이 동의한 약관을 조회한다', async () => {
        const result = await controller.findCustomerAgreedTerms(customer);
        expect(result.data!).toHaveLength(4);
        expect(result.data![0]).toHaveProperty('termId');
    });

    it('고객의 동의가 필요한 약관 목록을 조회한다', async () => {
        const result = await controller.findCustomerTerms(customer);
        expect(result.data!).toHaveLength(4);
    });

    it('고객의 동의가 필요한 필수 약관만 조회한다', async () => {
        const result = await controller.findCustomerTerms(customer, 'mandatory');
        expect(result.data!.every((t) => t.isMandatory)).toBe(true);
    });

    it('고객의 동의가 필요한 선택 약관만 조회한다', async () => {
        const result = await controller.findCustomerTerms(customer, 'optional');
        expect(result.data!.every((t) => !t.isMandatory)).toBe(true);
    });

    it('고객 약관 동의 정보 목록를 저장한다', async () => {
        const customerTerms: CustomerTermDto[] = [
            new CustomerTermDto(),
            new CustomerTermDto(),
        ];
        customerTerms[0].termId = 3;
        customerTerms[0].customerId = customer.customerId;
        customerTerms[0].version = 1;
        customerTerms[0].agreedAt = new Date();

        customerTerms[1].termId = 6;
        customerTerms[1].customerId = customer.customerId;
        customerTerms[1].version = 1;
        customerTerms[1].agreedAt = new Date();

        const result = await controller.saveCustomerTerms(customerTerms, customer);
        expect(result.data!).toHaveLength(2);
    });

    it('고객 특정 약관 동의 정보를 저장한다', async () => {
        const dto = new CustomerTermDto();
        dto.termId = 3;
        dto.customerId = customer.customerId;
        dto.version = 1;
        dto.agreedAt = new Date();

        const result = await controller.saveCustomerTerm(dto, customer);
        expect(result.data!.termId).toBe(3);
    });

    it('고객 약관 정보를 수정한다', async () => {
        const dto = new CustomerTermDto();
        dto.termId = 1;
        dto.customerId = customer.customerId;
        dto.version = 1;
        dto.agreedAt = new Date();

        const result = await controller.updateCustomerTerm(dto, customer);
        expect(result.data!.termId).toBe(1);
    });

    it('고객 약관 정보를 삭제한다', async () => {
        const result = await controller.deleteCustomerTerms(customer);
        expect(result.data!).toBeUndefined();

        const after = await controller.findCustomerAgreedTerms(customer);
        expect(after.data!).toHaveLength(0);
    });
});