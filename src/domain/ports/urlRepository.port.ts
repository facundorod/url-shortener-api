import { Url } from '@/domain/entities/url.entity';

export interface UrlRepository {
  create(url: Url): Promise<Url>;
  findByOriginalUrl(originalUrl: string): Promise<Url | null>;
}
