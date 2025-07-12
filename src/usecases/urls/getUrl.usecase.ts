import { CacheService } from '@/domain/ports/cacheService.port';
import { UrlRepository } from '@/domain/ports/urlRepository.port';
import { NotFoundException } from '@nestjs/common';

export class GetUrlUsecase {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(id: string): Promise<string> {
    const url: string | null = await this.cacheService.get(id);

    if (url) {
      console.log('cache hit');
      return url;
    }

    console.log('cache miss');
    const urlEntity = await this.urlRepository.findById(id);

    if (!urlEntity) {
      throw new NotFoundException('Url not found');
    }

    await this.cacheService.set(
      id,
      urlEntity.getOriginalUrl(),
      60 * 60 * 24 * 30, // 30 days
    );

    return urlEntity.getOriginalUrl();
  }
}
