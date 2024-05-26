import { Injectable } from "@nestjs/common";
import { RedisService } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";

@Injectable()
export class CacheService {
  private readonly redis: Redis;
  private readonly prefix: string = `mongle-server:${process.env.NODE_ENV}:`;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  async get(key: string): Promise<string> {
    return this.redis.get(`${this.prefix}${key}`);
  }

  async set(key: string, value: string, expireTime?: number): Promise<"OK"> {
    return this.redis.set(`${this.prefix}${key}`, value, "EX", expireTime ?? 60);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(`${this.prefix}${key}`);
  }

}