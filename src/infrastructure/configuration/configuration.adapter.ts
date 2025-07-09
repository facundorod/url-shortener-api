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
    return this.config.get<string>('DOMAIN') || 'localhost';
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
}
