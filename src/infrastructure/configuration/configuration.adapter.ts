import { ConfigurationService } from '@/domain/ports/configurationService.port';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationAdapter implements ConfigurationService {
  constructor(private readonly config: ConfigService) {}
  getAppEnv(): string {
    return this.config.getOrThrow<string>('APP_ENV');
  }
  getRedisHost(): string {
    return this.config.getOrThrow<string>('REDIS_HOST');
  }
  getRedisPort(): number {
    return this.config.getOrThrow<number>('REDIS_PORT');
  }
  getDomain(): string {
    return this.config.get<string>('DOMAIN') || 'http://localhost:3001';
  }
  getIncrementKey(): string {
    return this.config.getOrThrow<string>('INCREMENT_KEY');
  }
  getDatabaseUrl(): string {
    return this.config.getOrThrow<string>('DATABASE_URL');
  }
  getRedisPassword(): string {
    return this.config.get<string>('REDIS_PASSWORD') || '';
  }

  getSaltValue(): string {
    return this.config.getOrThrow<string>('SALT_VALUE') || '10';
  }

  getJwtSecret(): string {
    return this.config.getOrThrow<string>('JWT_SECRET') || 'secret';
  }

  getJwtExpiresIn(): string {
    return this.config.getOrThrow<string>('JWT_EXPIRES_IN') || '1d';
  }
}
