import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { DynamicModule } from '@nestjs/common';

export class RedisTestHelper {
  redisContainer: StartedRedisContainer;
  host: string;
  port: number;

  constructor() {}

  async start(): Promise<{
    container: StartedRedisContainer;
    host: string;
    port: number;
  }> {
    // Redis Testcontainers 설정
    this.redisContainer = await new RedisContainer().start();
    this.host = this.redisContainer.getHost();
    this.port = this.redisContainer.getMappedPort(6379);

    return {
      container: this.redisContainer,
      host: this.host,
      port: this.port,
    };
  }

  async stop() {
    await this.redisContainer.stop();
  }

  async module(): Promise<DynamicModule> {
    return RedisModule.forRootAsync({
      useFactory: async () => ({
        config: {
          host: this.host,
          port: this.port,
        },
        readyLog: true,
      }),
    });
  }
}
