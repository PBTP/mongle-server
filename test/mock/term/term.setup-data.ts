import { TermCategory, TermEntity } from '../../../src/schemas/terms.entity';
import { CustomerEntity } from '../../../src/schemas/customer.entity';
import { CustomerTermEntity } from '../../../src/schemas/customer-terms.entity';
import { FakeTermRepository } from './fake.term.repository';
import { FakeCustomerRepository } from '../fake.customer.repository';
import { FakeCustomerTermRepository } from './fake.customer-term.repository';
import { AuthProvider } from '../../../src/auth/presentation/user.dto';
import { Term } from '../../../src/terms/terms.domain';
import { CustomerTerm } from '../../../src/terms/customer-terms.domain';

// 필수 약관 1 - 동의 / 2 - 동의 후 만료 / 3 - 미동의
// 선택 약관 4 - 동의 / 5 - 동의 후 만료 / 6 - 미동의

export async function setupInitialTermData(
    fakeCustomerRepository: FakeCustomerRepository,
    fakeTermRepository: FakeTermRepository,
    fakeCustomerTermRepository: FakeCustomerTermRepository,
): Promise<CustomerEntity> {
    const now = new Date();

    // 1. 고객 생성
    const customer: CustomerEntity = fakeCustomerRepository.create({
        customerName: '홍길동',
        authProvider: AuthProvider.KAKAO,
    });
    fakeCustomerRepository.save(customer);

    // 2. 약관 생성
    const terms: TermEntity[] = [
        Object.assign(new TermEntity(), {
            version: 1,
            title: '서비스 이용약관',
            description: '서비스 사용에 대한 약관',
            isMandatory: true,
            termCategory: TermCategory.SERVICE,
            createdAt: now,
            modifiedAt: now,
            deletedAt: null,
            customerTerms: [],
        }),
        Object.assign(new TermEntity(), {
            version: 2,
            title: '개인정보 처리방침',
            description: '개인정보 보호를 위한 필수 약관',
            isMandatory: true,
            termCategory: TermCategory.PRIVACY,
            createdAt: now,
            modifiedAt: now,
            deletedAt: null,
            customerTerms: [],
        }),
        Object.assign(new TermEntity(), {
            version: 1,
            title: '제3자 정보제공 동의',
            description: '제3자 제공 관련 필수 약관',
            isMandatory: true,
            termCategory: TermCategory.SERVICE,
            createdAt: now,
            modifiedAt: now,
            deletedAt: null,
            customerTerms: [],
        }),
        Object.assign(new TermEntity(), {
            version: 1,
            title: '마케팅 수신 동의',
            description: '광고, 이벤트 정보 수신에 대한 동의',
            isMandatory: false,
            termCategory: TermCategory.MARKETING,
            createdAt: now,
            modifiedAt: now,
            deletedAt: null,
            customerTerms: [],
        }),
        Object.assign(new TermEntity(), {
            version: 2,
            title: '위치정보 수집 동의',
            description: '위치 기반 서비스 제공을 위한 약관',
            isMandatory: false,
            termCategory: TermCategory.LOCATION,
            createdAt: now,
            modifiedAt: now,
            deletedAt: null,
            customerTerms: [],
        }),
        Object.assign(new TermEntity(), {
            version: 1,
            title: '앱 푸시 수신 동의',
            description: '앱 알림 수신을 위한 선택 약관',
            isMandatory: false,
            termCategory: TermCategory.MARKETING,
            createdAt: now,
            modifiedAt: now,
            deletedAt: null,
            customerTerms: [],
        }),
    ];
    terms.forEach((entity, idx) => {
        entity.termId = idx + 1;
        const domain = entity.toModel();
        domain.termId = entity.termId;
        fakeTermRepository.save(domain);
    });


    // 3. 고객 약관 등록
    const customerTerms: CustomerTermEntity[] = [
        Object.assign(new CustomerTermEntity(), {
            id: 0,
            customerId: customer.customerId,
            termId: terms[0].termId,
            version: 1,
            agreedAt: now,
            customer,
            term: terms[0],
        }),
        Object.assign(new CustomerTermEntity(), {
            id: 0,
            customerId: customer.customerId,
            termId: terms[1].termId,
            version: 1,
            agreedAt: now,
            customer,
            term: terms[1],
        }),
        Object.assign(new CustomerTermEntity(), {
            id: 0,
            customerId: customer.customerId,
            termId: terms[3].termId,
            version: 1,
            agreedAt: now,
            customer,
            term: terms[3],
        }),
        Object.assign(new CustomerTermEntity(), {
            id: 0,
            customerId: customer.customerId,
            termId: terms[4].termId,
            version: 1,
            agreedAt: now,
            customer,
            term: terms[4],
        })]
    customerTerms.map(entity => fakeCustomerTermRepository.save(CustomerTerm.from(entity)));

    fakeTermRepository.syncCustomerTerms(fakeCustomerTermRepository.getAll());

    return customer;
}
