import { Module } from '@nestjs/common';
import { RedisAdapter } from './redis.adapter';
import { ConfigurationAdapter } from '@/infrastructure/configuration/configuration.adapter';
import { ConfigurationModule } from '@/infrastructure/configuration/configuration.module';

@Module({
  providers: [
    {
      provide: RedisAdapter,
      inject: [ConfigurationAdapter],
      useFactory: (config: ConfigurationAdapter) => new RedisAdapter(config),
    },
  ],
  imports: [ConfigurationModule],
  exports: [RedisAdapter],
})
export class RedisModule {}
