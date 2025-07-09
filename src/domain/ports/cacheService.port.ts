export interface CacheService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  incr(key: string): Promise<number>;
  decr(key: string): Promise<number>;
  expire(key: string, ttl: number): Promise<boolean>;
  ttl(key: string): Promise<number>;
}
