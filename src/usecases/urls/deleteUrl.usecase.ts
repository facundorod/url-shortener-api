import { ForbiddenException, Injectable } from '@nestjs/common';
import { UrlRepository } from '@/domain/ports/urlRepository.port';
import { CacheService } from '@/domain/ports/cacheService.port';
import { UrlNotFound } from '@/domain/errors/urlNotFound.error';
@Injectable()
export class DeleteUrlUsecase {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(id: string, createdBy: number): Promise<boolean> {
    const url = await this.urlRepository.findById(id);
    if (!url) throw new UrlNotFound();
    if (url.getCreatedBy().getId() !== createdBy)
      throw new ForbiddenException('You are not allowed to delete this URL');
    await this.urlRepository.deleteById(id);
    await this.cacheService.delete(url.getId());

    return true;
  }
}
