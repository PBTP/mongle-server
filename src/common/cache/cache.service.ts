import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

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

  async getData<T>(key: string): Promise<T> {
    const obj = await this.redis.get(`${this.prefix}${key}`);
    return obj ? (JSON.parse(obj) as T) : undefined;
  }

  async set(key: string, value: string, expireTime?: number): Promise<'OK'> {
    if (!expireTime) {
      return this.redis.set(`${this.prefix}${key}`, value);
    }
    return this.redis.set(`${this.prefix}${key}`, value, 'EX', expireTime);
  }

  async setData<T>(key: string, value: T, expireTime?: number): Promise<'OK'> {
    return this.set(key, JSON.stringify(value), expireTime);
  }

  async sadd(key: string, value: any): Promise<number> {
    try {
      typeof value === 'object' && (value = JSON.stringify(value));
    } catch (e) {}

    return this.redis.sadd(`${this.prefix}${key}`, value);
  }

  async smembers(key: string): Promise<string[]> {
    return this.redis.smembers(`${this.prefix}${key}`);
  }
  async smembersData<T>(key: string): Promise<T[]> {
    return this.redis
      .smembers(`${this.prefix}${key}`)
      .then((v) => v.map((v) => JSON.parse(v) as T));
  }

  async del(key: string): Promise<number> {
    return this.redis.del(`${this.prefix}${key}`);
  }

  async srem(key: string, value: any): Promise<number> {
    try {
      typeof value === 'object' && (value = JSON.stringify(value));
    } catch (e) {}

    return this.redis.srem(`${this.prefix}${key}`, value);
  }
}
