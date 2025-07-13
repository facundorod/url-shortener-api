import { Url } from '@/domain/entities/url.entity';
import { UrlRepository } from '@/domain/ports/urlRepository.port';
import { TypeOrmUrlEntity } from '@/infrastructure/database/entities/url.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmUrlRepository implements UrlRepository {
  constructor(
    @InjectRepository(TypeOrmUrlEntity)
    private readonly urlRepository: Repository<TypeOrmUrlEntity>,
  ) {}

  async create(url: Url): Promise<Url> {
    const urlEntity: TypeOrmUrlEntity = TypeOrmUrlEntity.fromDomain(url);
    const savedUrl: TypeOrmUrlEntity = await this.urlRepository.save(urlEntity);
    return savedUrl.toDomain();
  }

  async findByOriginalUrl(originalUrl: string): Promise<Url | null> {
    const url = await this.urlRepository.findOne({
      where: { originalUrl },
      relations: ['createdBy'],
    });
    if (!url) return null;
    return url.toDomain();
  }

  async findById(id: string): Promise<Url | null> {
    const url = await this.urlRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!url) return null;
    return url.toDomain();
  }

  async findByCreatedBy(createdBy: number): Promise<Url[]> {
    const urls = await this.urlRepository.find({
      where: { createdBy: { id: createdBy } },
      relations: ['createdBy'],
    });
    if (!urls) return [];
    return urls.map(url => url.toDomain());
  }

  async deleteById(id: string): Promise<void> {
    await this.urlRepository.delete({ id });
  }
}
