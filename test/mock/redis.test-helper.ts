import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { DynamicModule, Logger } from '@nestjs/common';

export class RedisTestHelper {
  private readonly logger = new Logger(RedisTestHelper.name);
  redisContainer: StartedRedisContainer;
  host: string;
  port: number;

  constructor() {}

  async start(): Promise<{
    container: StartedRedisContainer;
    host: string;
    port: number;
  }> {
    this.logger.log('Starting Redis Testcontainers');
    // Redis Testcontainers 설정
    this.redisContainer = await new RedisContainer().start();
    this.host = this.redisContainer.getHost();
    this.port = this.redisContainer.getMappedPort(6379);

    this.logger.log('Started Redis Testcontainers');
    return {
      container: this.redisContainer,
      host: this.host,
      port: this.port,
    };
  }

  async stop() {
    this.logger.log('Stopping Redis Testcontainers');
    try {
      await this.redisContainer.stop();
      this.logger.log('Stopped Redis Testcontainers');
    } catch (error) {
      this.logger.error('Error stopping Redis Testcontainers', error);
    }
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
