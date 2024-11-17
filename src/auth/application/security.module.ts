import { Global, Module } from '@nestjs/common';
import { SECURITY_SERVICE, SecurityService } from './security.service';

@Global()
@Module({
  providers: [
    {
      provide: SECURITY_SERVICE,
      useClass: SecurityService,
    },
  ],
  exports: [
    {
      provide: SECURITY_SERVICE,
      useClass: SecurityService,
    },
  ],
})
export class SecurityModule {}
