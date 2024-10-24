import { Test, TestingModule } from "@nestjs/testing";
import { CustomerService } from "./customer.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Customer } from "../../schemas/customer.entity";
import { Repository } from "typeorm";
import { AuthProvider } from "../../auth/presentation/user.dto";

describe('CustomerService', () => {
  let service: CustomerService;
  let repo: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository<Customer>,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repo = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should create a customer', async () => {
    const customer = new Customer();
    customer.customerId = 1;
    customer.customerName = 'test';
    customer.uuid = 'test';
    customer.authProvider = AuthProvider.BASIC;

    jest.spyOn(repo, 'create').mockReturnValueOnce(customer);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(customer);

    expect(
      await service.create({
        uuid: 'test',
        customerName: 'test',
        userType: 'customer',
        phoneNumber: '0101111111',
        authProvider: AuthProvider.BASIC,
      }),
    ).toEqual(customer);
  });

  it('should find one customer', async () => {
    const customer = new Customer();
    customer.customerId = 1;
    customer.customerName = 'test';
    customer.uuid = 'test';
    customer.authProvider = AuthProvider.BASIC;

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(customer);

    expect(await service.findOne({ userId: 1 })).toEqual(customer);
  });

  it('should update a customer', async () => {
    const customer = new Customer();
    customer.customerId = 1;
    customer.customerName = 'test';
    customer.uuid = 'test';
    customer.authProvider = AuthProvider.BASIC;

    const updatedCustomer = new Customer();
    updatedCustomer.customerId = 1;
    updatedCustomer.customerName = 'updated test';
    updatedCustomer.uuid = 'test';
    updatedCustomer.authProvider = AuthProvider.BASIC;

    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(customer);
    jest.spyOn(repo, 'save').mockResolvedValueOnce(updatedCustomer);

    expect(
      await service.update({
        userId: 1,
        name: 'updated test',
        phoneNumber: '0101111111',
      }),
    ).toEqual(updatedCustomer);
  });
});
