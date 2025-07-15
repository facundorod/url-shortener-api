import { CacheService } from '@/domain/ports/cacheService.port';
import { ConfigurationService } from '@/domain/ports/configurationService.port';
import { UrlRepository } from '@/domain/ports/urlRepository.port';

export class GetUrlUsecase {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigurationService,
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
      const notFoundUrl = this.configService.getFrontendUrl();
      return `${notFoundUrl}/not-found`;
    }

    await this.cacheService.set(
      id,
      urlEntity.getOriginalUrl(),
      60 * 60 * 24 * 30, // 30 days
    );

    return urlEntity.getOriginalUrl();
  }
}
