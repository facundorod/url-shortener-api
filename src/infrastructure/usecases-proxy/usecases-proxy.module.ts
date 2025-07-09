import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from './usecases.proxy';
import { CreateUrlUsecase } from '@/usecases/createUrl.usecase';
import { UserRepository } from '@/domain/ports/userRepository.port';
import { ConfigurationService } from '@/domain/ports/configurationService.port';
import { UrlRepository } from '@/domain/ports/urlRepository.port';
import { CacheService } from '@/domain/ports/cacheService.port';
import { TypeOrmUrlRepository } from '../adapters/repositories/url.repository';
import { ConfigurationModule } from '../configuration/configuration.module';
import { RedisAdapter } from '../adapters/redis/redis.adapter';
import { RedisModule } from '../adapters/redis/redis.module';
import { ConfigurationAdapter } from '../configuration/configuration.adapter';
import { TypeOrmUserRepository } from '../adapters/repositories/user.repository';
import { RepositoriesModule } from '../adapters/repositories/repositories.module';

@Module({
  imports: [ConfigurationModule, RedisModule, RepositoriesModule],
})
export class UsecasesProxyModule {
  static readonly CREATE_URL_USECASE = 'CREATE_URL_USECASE';
  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          provide: UsecasesProxyModule.CREATE_URL_USECASE,
          useFactory: (
            urlRepository: UrlRepository,
            cacheService: CacheService,
            configurationService: ConfigurationService,
            userRepository: UserRepository,
          ) =>
            new UseCaseProxy(
              new CreateUrlUsecase(
                urlRepository,
                cacheService,
                configurationService,
                userRepository,
              ),
            ),
          inject: [
            TypeOrmUrlRepository,
            RedisAdapter,
            ConfigurationAdapter,
            TypeOrmUserRepository,
          ],
        },
      ],
      exports: [UsecasesProxyModule.CREATE_URL_USECASE],
    };
  }
}
