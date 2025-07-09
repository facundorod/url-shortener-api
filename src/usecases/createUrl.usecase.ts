import { Url } from '@/domain/entities/url.entity';
import { CacheService } from '@/domain/ports/cacheService.port';
import { ConfigurationService } from '@/domain/ports/configurationService.port';
import { UrlRepository } from '@/domain/ports/urlRepository.port';
import { Base62Util } from '@/utils/base62.util';
import { CreateUrlDto } from '@/domain/dtos/createUrl.dto';
import { UserRepository } from '@/domain/ports/userRepository.port';
import { User } from '@/domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

export class CreateUrlUsecase {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly cacheService: CacheService,
    private readonly configurationService: ConfigurationService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(url: CreateUrlDto, userId: number): Promise<Url> {
    const user: User | null = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const nextNumber = await this.cacheService.incr(
      this.configurationService.getIncrementKey(),
    );

    const base62 = Base62Util.generateBase62(nextNumber);

    const shortUrl: string = `https://${this.configurationService.getDomain()}/${base62}`;

    const newUrl = new Url(shortUrl, url.originalUrl, user);

    const createdUrl = await this.urlRepository.create(newUrl);

    return createdUrl;
  }
}
