import { AuthProvider } from '../../../src/auth/presentation/user.dto';
import { CustomerTermEntity } from '../../../src/schemas/customer-terms.entity';
import { CustomerEntity } from '../../../src/schemas/customer.entity';
import { TermCategory, TermEntity } from '../../../src/schemas/terms.entity';
import { FakeCustomerTermRepository } from '../../mock/fake.customer-term.repository';
import { FakeCustomerRepository } from '../../mock/fake.customer.repository';
import { FakeTermRepository } from '../../mock/fake.term.repository';

export async function setupInitialData(
  fakeCustomerRepository: FakeCustomerRepository,
  fakeTermRepository: FakeTermRepository,
  fakeCustomerTermRepository: FakeCustomerTermRepository,
) {
  // Customer 초기 데이터
  const customer1: CustomerEntity = fakeCustomerRepository.create({
    customerName: 'Kim',
    authProvider: AuthProvider.APPLE,
  });

  const customer2: CustomerEntity = fakeCustomerRepository.create({
    customerName: 'Lee',
    authProvider: AuthProvider.GOOGLE,
  });

  // Term 초기 데이터
  const term1: TermEntity = fakeTermRepository.create({
    title: '서비스 이용 약관',
    description: '서비스 이용에 대한 기본적인 약관입니다.',
    version: 1,
    termCategory: TermCategory.SERVICE,
    isMandatory: true,
    customerTerms: [],
  });

  const term2: TermEntity = fakeTermRepository.create({
    title: '개인정보 처리 방침',
    description: '개인정보 보호를 위한 정책을 포함합니다.',
    version: 1,
    termCategory: TermCategory.PRIVACY,
    isMandatory: true,
    customerTerms: [],
  });

  const term3: TermEntity = fakeTermRepository.create({
    title: '위치 정보 이용 동의',
    description: '위치 정보 제공에 대한 동의가 필요합니다.',
    version: 1,
    termCategory: TermCategory.LOCATION,
    isMandatory: true,
    customerTerms: [],
  });

  const term4: TermEntity = fakeTermRepository.create({
    title: '마케팅 정보 수신 동의',
    description: '마케팅 및 프로모션 정보를 받을지 선택할 수 있습니다.',
    version: 1,
    termCategory: TermCategory.MARKETING,
    isMandatory: false,
    customerTerms: [],
  });

  const term5: TermEntity = fakeTermRepository.create({
    title: '광고 맞춤 추천 동의',
    description: '개인 맞춤 광고 추천을 위한 동의입니다.',
    version: 1,
    termCategory: TermCategory.MARKETING,
    isMandatory: false,
    customerTerms: [],
  });

  // CustomerTerm 초기 데이터 & Term과 연결
  const customerTerms = [
    { customer: customer1, term: term1, version: 1 },
    { customer: customer1, term: term2, version: 1 },
    { customer: customer2, term: term3, version: 1 },
    { customer: customer2, term: term4, version: 1 },
    { customer: customer2, term: term5, version: 1 },
  ].map(({ customer, term, version }) => {
    const entity = new CustomerTermEntity();
    entity.customer = customer;
    entity.term = term;
    entity.version = version;
    entity.agreedAt = new Date();
    customer.customerTerms.push(entity);
    term.customerTerms.push(entity);
    return entity;
  });
}
