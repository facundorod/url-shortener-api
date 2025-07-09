import { CacheService } from '@/domain/ports/cacheService.port';
import { ConfigurationAdapter } from '@/infrastructure/configuration/configuration.adapter';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisAdapter implements CacheService {
  private readonly redis: Redis;
  constructor(private readonly config: ConfigurationAdapter) {
    this.redis = new Redis({
      host: this.config.getRedisHost(),
      port: this.config.getRedisPort(),
      password: this.config.getRedisPassword(),
    });

    this.redis.on('error', error => {
      console.error('Redis error:', error);
    });
    this.redis.on('connect', () => {
      console.log('Redis connected');
    });
    this.redis.on('reconnecting', () => {
      console.log('Redis reconnecting');
    });
    this.redis.on('ready', () => {
      console.log('Redis ready');
    });
    this.redis.on('end', () => {
      console.log('Redis end');
    });
    this.redis.on('close', () => {
      console.log('Redis close');
    });
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    const result = await this.redis.expire(key, ttl);
    return result > 0;
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttl);
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.redis.del(key);
    return result > 0;
  }

  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  async decr(key: string): Promise<number> {
    return this.redis.decr(key);
  }
}
