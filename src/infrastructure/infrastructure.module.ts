import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ControllersModule } from './controllers/controllers.module';
import { UsecasesProxyModule } from './usecases-proxy/usecases-proxy.module';
import { RedisModule } from './adapters/redis/redis.module';
import { RepositoriesModule } from './adapters/repositories/repositories.module';
import { BcryptModule } from './adapters/bcrypt/bcrypt.module';
import { JsonwebtokenModule } from './adapters/jsonwebtoken/jsonwebtoken.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigurationModule,
    ControllersModule,
    UsecasesProxyModule,
    RedisModule,
    RepositoriesModule,
    BcryptModule,
    JsonwebtokenModule,
  ],
  providers: [],
})
export class InfrastructureModule {}
