import { ICacheService } from '../../src/common/cache/cache.service';

export class FakeCacheService implements ICacheService {
  private readonly cache: Map<string, any> = new Map<string, any>();
  get(key: string): Promise<string | null> {
    return Promise.resolve(this.cache.get(key));
  }
  getData<T>(key: string): Promise<T | undefined> {
    return Promise.resolve(this.cache.get(key) as T);
  }
  set(
    key: string,
    value: string,
    expireTime?: number | undefined,
  ): Promise<'OK'> {
    this.cache.set(key, value);
    return Promise.resolve('OK');
  }
  setData<T>(
    key: string,
    value: T,
    expireTime?: number | undefined,
  ): Promise<'OK'> {
    this.cache.set(key, value);
    return Promise.resolve('OK');
  }
  del(key: string): Promise<number> {
    this.cache.delete(key);
    return Promise.resolve(1);
  }
}
