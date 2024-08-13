import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from 'socket.io-redis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { NestExpressApplication } from '@nestjs/platform-express';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(
    private readonly nestExpressApplication: NestExpressApplication,
    private readonly redisService: RedisService,
  ) {
    super(nestExpressApplication);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = this.redisService.getClient().duplicate();
    const subClient = pubClient.duplicate();

    // await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter({ pubClient, subClient });
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
