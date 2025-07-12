import { Injectable } from '@nestjs/common';
import { UrlRepository } from '@/domain/ports/urlRepository.port';
import { Url } from '@/domain/entities/url.entity';

@Injectable()
export class GetUrlsUsecase {
  constructor(private readonly urlRepository: UrlRepository) {}

  async execute(createdBy: number): Promise<Url[]> {
    const urls = await this.urlRepository.findByCreatedBy(createdBy);
    return urls;
  }
}
