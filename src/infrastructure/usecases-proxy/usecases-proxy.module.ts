import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from './usecases.proxy';
import { CreateUrlUsecase } from '@/usecases/urls/createUrl.usecase';
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
import { GetUrlUsecase } from '@/usecases/urls/getUrl.usecase';
import { GetUrlsUsecase } from '@/usecases/urls/getUrls.usecase';
import { DeleteUrlUsecase } from '@/usecases/urls/deleteUrl.usecase';
import { RegisterUsecase } from '@/usecases/auth/register.usecase';
import { BCryptService } from '../adapters/bcrypt/bcrypt.adapter';
import { HashService } from '@/domain/ports/hashService.port';
import { BcryptModule } from '../adapters/bcrypt/bcrypt.module';
import { EncrypterService } from '@/domain/ports/envrypterService.port';
import { LoginUsecase } from '@/usecases/auth/login.usecase';
import { JsonWebTokenAdapter } from '../adapters/jsonwebtoken/jsonwebtoken.adapter';
import { JsonwebtokenModule } from '../adapters/jsonwebtoken/jsonwebtoken.module';

@Module({
  imports: [
    ConfigurationModule,
    RedisModule,
    RepositoriesModule,
    BcryptModule,
    JsonwebtokenModule,
  ],
})
export class UsecasesProxyModule {
  static readonly CREATE_URL_USECASE = 'CREATE_URL_USECASE';
  static readonly GET_URL_USECASE = 'GET_URL_USECASE';
  static readonly GET_URLS_USECASE = 'GET_URLS_USECASE';
  static readonly DELETE_URL_USECASE = 'DELETE_URL_USECASE';
  static readonly REGISTER_USER_USECASE = 'REGISTER_USER_USECASE';
  static readonly LOGIN_USER_USECASE = 'LOGIN_USER_USECASE';
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
        {
          provide: UsecasesProxyModule.GET_URL_USECASE,
          useFactory: (
            urlRepository: UrlRepository,
            cacheService: CacheService,
          ) => new UseCaseProxy(new GetUrlUsecase(urlRepository, cacheService)),
          inject: [TypeOrmUrlRepository, RedisAdapter],
        },
        {
          provide: UsecasesProxyModule.GET_URLS_USECASE,
          useFactory: (urlRepository: UrlRepository) =>
            new UseCaseProxy(new GetUrlsUsecase(urlRepository)),
          inject: [TypeOrmUrlRepository],
        },
        {
          provide: UsecasesProxyModule.DELETE_URL_USECASE,
          useFactory: (
            urlRepository: UrlRepository,
            cacheService: CacheService,
          ) =>
            new UseCaseProxy(new DeleteUrlUsecase(urlRepository, cacheService)),
          inject: [TypeOrmUrlRepository, RedisAdapter],
        },
        {
          provide: UsecasesProxyModule.REGISTER_USER_USECASE,
          useFactory: (
            userRepository: UserRepository,
            hashService: HashService,
          ) =>
            new UseCaseProxy(new RegisterUsecase(userRepository, hashService)),
          inject: [TypeOrmUserRepository, BCryptService],
        },
        {
          provide: UsecasesProxyModule.LOGIN_USER_USECASE,
          useFactory: (
            encrypterService: EncrypterService,
            userRepository: UserRepository,
            hashService: HashService,
          ) =>
            new UseCaseProxy(
              new LoginUsecase(encrypterService, userRepository, hashService),
            ),
          inject: [JsonWebTokenAdapter, TypeOrmUserRepository, BCryptService],
        },
      ],
      exports: [
        UsecasesProxyModule.CREATE_URL_USECASE,
        UsecasesProxyModule.GET_URL_USECASE,
        UsecasesProxyModule.GET_URLS_USECASE,
        UsecasesProxyModule.DELETE_URL_USECASE,
        UsecasesProxyModule.REGISTER_USER_USECASE,
        UsecasesProxyModule.LOGIN_USER_USECASE,
      ],
    };
  }
}
