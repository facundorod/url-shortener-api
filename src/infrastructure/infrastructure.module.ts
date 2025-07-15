import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ControllersModule } from './controllers/controllers.module';
import { UsecasesProxyModule } from './usecases-proxy/usecases-proxy.module';
import { RedisModule } from './adapters/redis/redis.module';
import { RepositoriesModule } from './adapters/repositories/repositories.module';
import { BcryptModule } from './adapters/bcrypt/bcrypt.module';
import { JsonwebtokenModule } from './adapters/jsonwebtoken/jsonwebtoken.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { EncrypterService } from '@/domain/ports/envrypterService.port';
import { AuthGuard } from './guards/auth/auth.guard';
import { JsonWebTokenAdapter } from './adapters/jsonwebtoken/jsonwebtoken.adapter';
import { WinstonModule } from './adapters/winston/winston.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    DatabaseModule,
    ConfigurationModule,
    ControllersModule,
    UsecasesProxyModule,
    RedisModule,
    RepositoriesModule,
    BcryptModule,
    JsonwebtokenModule,
    WinstonModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      inject: [JsonWebTokenAdapter, Reflector],
      useFactory: (
        jsonWebTokenAdapter: EncrypterService,
        reflector: Reflector,
      ) => new AuthGuard(jsonWebTokenAdapter, reflector),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class InfrastructureModule {}
