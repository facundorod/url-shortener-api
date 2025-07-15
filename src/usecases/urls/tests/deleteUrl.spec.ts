import { UrlRepository } from '@/domain/ports/urlRepository.port';
import { DeleteUrlUsecase } from '../deleteUrl.usecase';
import { CacheService } from '@/domain/ports/cacheService.port';
import { Url } from '@/domain/entities/url.entity';
import { User } from '@/domain/entities/user.entity';
import { UrlNotFound } from '@/domain/errors/urlNotFound.error';

describe('DeleteUrlUsecase', () => {
  let deleteUrlUsecase: DeleteUrlUsecase;
  let urlRepository: jest.Mocked<UrlRepository>;
  let cacheService: jest.Mocked<CacheService>;
  let cacheSpy: jest.SpyInstance;
  let urlRepositorySpy: jest.SpyInstance;
  const validUserId: number = 123456;
  const validUser = new User(validUserId, 'test@test.com', 'test', 'test');

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
    cacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      incr: jest.fn(),
      decr: jest.fn(),
      expire: jest.fn(),
      ttl: jest.fn(),
    };

    deleteUrlUsecase = new DeleteUrlUsecase(urlRepository, cacheService);
  });

  it('should delete a url', async () => {
    const url = new Url('123456', 'https://www.google.com', validUser);
    urlRepository.findById.mockResolvedValueOnce(url);
    cacheSpy = jest.spyOn(cacheService, 'delete');
    cacheService.delete.mockResolvedValueOnce(true);
    urlRepositorySpy = jest.spyOn(urlRepository, 'deleteById');
    const createdUrl = await deleteUrlUsecase.execute(url.getId(), validUserId);
    expect(createdUrl).toBe(true);
    expect(cacheSpy).toHaveBeenCalledWith(url.getId());
    expect(urlRepositorySpy).toHaveBeenCalledWith(url.getId());
  });

  it('should throw an error if the url is not found', async () => {
    urlRepository.findById.mockResolvedValueOnce(null);
    urlRepositorySpy = jest.spyOn(urlRepository, 'deleteById');
    cacheSpy = jest.spyOn(cacheService, 'delete');
    await expect(
      deleteUrlUsecase.execute('123456', validUserId),
    ).rejects.toThrow(UrlNotFound);
    expect(urlRepositorySpy).not.toHaveBeenCalled();
    expect(cacheSpy).not.toHaveBeenCalled();
  });

  it('should throw an error if the user is not allowed to delete the url', async () => {
    const url = new Url(
      '123456',
      'https://www.google.com',
      new User(34, 'test@test.com', 'test', 'test'),
    );
    urlRepository.findById.mockResolvedValueOnce(url);
    await expect(deleteUrlUsecase.execute(url.getId(), 2)).rejects.toThrow(
      'You are not allowed to delete this URL',
    );
    expect(urlRepositorySpy).not.toHaveBeenCalled();
    expect(cacheSpy).not.toHaveBeenCalled();
  });
});
