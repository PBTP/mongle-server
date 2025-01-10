import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CACHE_SERVICE, CacheService } from './cache.service';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: CACHE_SERVICE,
      useClass: CacheService,
    },
  ],
  exports: [
    {
      provide: CACHE_SERVICE,
      useClass: CacheService,
    },
  ],
})
export class CacheModule {}
