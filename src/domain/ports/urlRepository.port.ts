import { Url } from '@/domain/entities/url.entity';

export interface UrlRepository {
  create(url: Url): Promise<Url>;
  findByOriginalUrl(originalUrl: string): Promise<Url | null>;
  findById(id: string): Promise<Url | null>;
  findByCreatedBy(createdBy: number): Promise<Url[]>;
  deleteById(id: string): Promise<void>;
}
