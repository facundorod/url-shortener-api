import { CacheService } from '@/domain/ports/cacheService.port';
import { UrlRepository } from '@/domain/ports/urlRepository.port';
import { GetUrlUsecase } from '../getUrl.usecase';
import { Url } from '@/domain/entities/url.entity';
import { User } from '@/domain/entities/user.entity';

describe('GetUrlUsecase', () => {
  let getUrlUsecase: GetUrlUsecase;
  let urlRepository: jest.Mocked<UrlRepository>;
  let cacheService: jest.Mocked<CacheService>;
  let urlRepositorySpy: jest.SpyInstance;
  let cacheSpy: jest.SpyInstance;
  const validUser = new User(1, 'test@test.com', 'test', 'test');
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
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
    getUrlUsecase = new GetUrlUsecase(urlRepository, cacheService);
  });

  it('should return the short url from cache', async () => {
    const originalUrl = 'https://www.google.com';
    const shortUrl = 'https://localhost/123456';
    cacheService.get.mockResolvedValueOnce(shortUrl);
    cacheSpy = jest.spyOn(cacheService, 'get');
    const result = await getUrlUsecase.execute(originalUrl);
    expect(result).toBe(shortUrl);
    expect(cacheSpy).toHaveBeenCalledWith(originalUrl);
  });

  it('should return the short url from database and cache it if it is not in cache', async () => {
    const originalUrl = 'https://www.google.com';
    const shortUrl = 'https://localhost/123456';
    urlRepositorySpy = jest.spyOn(urlRepository, 'findByOriginalUrl');
    urlRepository.findByOriginalUrl.mockResolvedValueOnce(
      new Url(shortUrl, originalUrl, validUser),
    );
    cacheSpy = jest.spyOn(cacheService, 'set');
    const result = await getUrlUsecase.execute(originalUrl);
    expect(result).toBe(shortUrl);
    expect(urlRepositorySpy).toHaveBeenCalledWith(originalUrl);
    expect(cacheSpy).toHaveBeenCalledWith(
      originalUrl,
      shortUrl,
      60 * 60 * 24 * 30,
    );
  });
});
