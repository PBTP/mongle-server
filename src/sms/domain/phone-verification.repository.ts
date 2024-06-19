import { PhoneVerification } from 'src/schemas/phone-verification.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PhoneVerification)
export class PhoneVerificationRepository extends Repository<PhoneVerification> {}
