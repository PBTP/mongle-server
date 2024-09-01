import { Module } from '@nestjs/common';
import { ENCRYPTION_SERVICE } from './domain/encryption-service.interface';
import { EncryptionService } from './application/encryption-service';

@Module({
  providers: [
    {
      provide: ENCRYPTION_SERVICE,
      useClass: EncryptionService,
    },
  ],
  exports: [ENCRYPTION_SERVICE],
})
export class EncryptionModule {}
