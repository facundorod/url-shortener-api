import { UrlRepository } from '@/domain/ports/urlRepository.port';
import { CreateUrlUsecase } from '../createUrl.usecase';
import { CacheService } from '@/domain/ports/cacheService.port';
import { ConfigurationService } from '@/domain/ports/configurationService.port';
import { UserRepository } from '@/domain/ports/userRepository.port';
import { CreateUrlDto } from '@/domain/dtos/createUrl.dto';
import { Url } from '@/domain/entities/url.entity';
import { User } from '@/domain/entities/user.entity';
import { Base62Util } from '@/utils/base62.util';

describe('CreateUrlUsecase', () => {
  let createUrlUsecase: CreateUrlUsecase;
  let urlRepository: jest.Mocked<UrlRepository>;
  let cacheService: jest.Mocked<CacheService>;
  let configurationService: jest.Mocked<ConfigurationService>;
  let userRepository: jest.Mocked<UserRepository>;
  let cacheSpy: jest.SpyInstance;
  let urlRepositorySpy: jest.SpyInstance;
  let userRepositorySpy: jest.SpyInstance;
  const invalidUserId: number = -1;
  const validUserId: number = 123456;
  const validUser = new User(validUserId, 'test@test.com', 'test', 'test');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    userRepository = {
      findById: jest.fn(),
    };
    urlRepository = {
      create: jest.fn(),
      findByOriginalUrl: jest.fn(),
    };
    cacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      incr: jest.fn(),
      decr: jest.fn(),
      expire: jest.fn(),
      ttl: jest.fn(),
    };
    configurationService = {
      getDatabaseUrl: jest.fn(),
      getRedisHost: jest.fn(),
      getRedisPort: jest.fn(),
      getDomain: jest.fn().mockReturnValue('localhost'),
      getIncrementKey: jest.fn(),
      getAppEnv: jest.fn(),
    } as unknown as jest.Mocked<ConfigurationService>;
    createUrlUsecase = new CreateUrlUsecase(
      urlRepository,
      cacheService,
      configurationService,
      userRepository,
    );
  });

  it('should create a new url', async () => {
    const url: CreateUrlDto = {
      originalUrl: 'https://www.google.com',
      expiresAt: new Date(),
    };
    cacheSpy = jest.spyOn(cacheService, 'incr');
    urlRepositorySpy = jest.spyOn(urlRepository, 'create');
    userRepositorySpy = jest.spyOn(userRepository, 'findById');
    cacheService.incr.mockResolvedValueOnce(1);
    userRepository.findById.mockResolvedValueOnce(validUser);
    const expectedUrl = new Url(
      `https://${configurationService.getDomain()}/${Base62Util.generateBase62(1)}`,
      url.originalUrl,
      validUser,
    );
    urlRepository.create.mockResolvedValueOnce(expectedUrl);

    const createdUrl = await createUrlUsecase.execute(url, validUserId);
    expect(createdUrl).toEqual(expectedUrl);
    expect(cacheSpy).toHaveBeenCalledWith(
      configurationService.getIncrementKey(),
    );
    expect(urlRepositorySpy).toHaveBeenCalledWith(expectedUrl);
    expect(userRepositorySpy).toHaveBeenCalledWith(validUserId);
  });

  it('should throw an error if the user is not found', async () => {
    const url: CreateUrlDto = {
      originalUrl: 'https://www.google.com',
    };
    userRepositorySpy = jest.spyOn(userRepository, 'findById');
    userRepository.findById.mockResolvedValueOnce(null);
    await expect(createUrlUsecase.execute(url, invalidUserId)).rejects.toThrow(
      'User not found',
    );
    expect(userRepositorySpy).toHaveBeenCalledWith(invalidUserId);
    expect(urlRepositorySpy).not.toHaveBeenCalled();
    expect(cacheSpy).not.toHaveBeenCalled();
  });
});
