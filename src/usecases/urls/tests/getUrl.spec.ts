import { CacheService } from '@/domain/ports/cacheService.port';
import { UrlRepository } from '@/domain/ports/urlRepository.port';
import { GetUrlUsecase } from '../getUrl.usecase';
import { Url } from '@/domain/entities/url.entity';
import { User } from '@/domain/entities/user.entity';
import { ConfigurationService } from '@/domain/ports/configurationService.port';

describe('GetUrlUsecase', () => {
  let getUrlUsecase: GetUrlUsecase;
  let urlRepository: jest.Mocked<UrlRepository>;
  let cacheService: jest.Mocked<CacheService>;
  let urlRepositorySpy: jest.SpyInstance;
  let cacheSpy: jest.SpyInstance;
  let configService: jest.Mocked<ConfigurationService>;
  const validUser = new User(1, 'test@test.com', 'test', 'test');
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    urlRepository = {
      create: jest.fn(),
      findByOriginalUrl: jest.fn(),
      findById: jest.fn(),
      findByCreatedBy: jest.fn(),
      deleteById: jest.fn(),
    };
    configService = {
      getDatabaseUrl: jest.fn(),
      getRedisHost: jest.fn(),
      getRedisPort: jest.fn(),
      getDomain: jest.fn().mockReturnValue('http://localhost'),
      getIncrementKey: jest.fn(),
      getAppEnv: jest.fn(),
      getFrontendUrl: jest.fn().mockReturnValue('http://localhost:3000'),
    } as unknown as jest.Mocked<ConfigurationService>;
    cacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      incr: jest.fn(),
      decr: jest.fn(),
      expire: jest.fn(),
      ttl: jest.fn(),
    };
    getUrlUsecase = new GetUrlUsecase(
      urlRepository,
      cacheService,
      configService,
    );
  });

  it('should return the short url from cache', async () => {
    const originalUrl = 'https://www.google.com';
    const urlId = '123456';

    cacheService.get.mockResolvedValueOnce(originalUrl);
    cacheSpy = jest.spyOn(cacheService, 'get');

    const result = await getUrlUsecase.execute(urlId);

    expect(result).toBe(originalUrl);
    expect(cacheSpy).toHaveBeenCalledWith(urlId);
  });

  it('should return the not found url if the url is not found', async () => {
    const urlId = '123456';
    cacheService.get.mockResolvedValueOnce(null);
    urlRepository.findById.mockResolvedValueOnce(null);
    const result = await getUrlUsecase.execute(urlId);
    expect(result).toBe('http://localhost:3000/not-found');
  });

  it('should return the short url from database and cache it if it is not in cache', async () => {
    const originalUrl = 'https://www.google.com';
    const shortUrl = 'https://localhost/123456';
    const urlId = '123456';

    // Mock cache miss
    cacheService.get.mockResolvedValueOnce(null);

    urlRepositorySpy = jest.spyOn(urlRepository, 'findById');
    urlRepository.findById.mockResolvedValueOnce(
      new Url(shortUrl, originalUrl, validUser, new Date(), urlId),
    );

    cacheSpy = jest.spyOn(cacheService, 'set');

    const result = await getUrlUsecase.execute(urlId);

    expect(result).toBe(originalUrl);
    expect(urlRepositorySpy).toHaveBeenCalledWith(urlId);
    expect(cacheSpy).toHaveBeenCalledWith(
      urlId,
      originalUrl,
      60 * 60 * 24 * 30,
    );
  });
});
