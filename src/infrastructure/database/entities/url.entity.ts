import { Url } from '@/domain/entities/url.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { TypeOrmUserEntity } from './user.entity';

@Entity('urls')
export class TypeOrmUrlEntity {
  @Column({ nullable: false, unique: true, primary: true })
  id: string;

  @Column({ nullable: false })
  originalUrl: string;

  @Column({ nullable: false })
  shortUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => TypeOrmUserEntity, user => user.urls, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: TypeOrmUserEntity;

  static fromDomain(url: Url): TypeOrmUrlEntity {
    const entity = new TypeOrmUrlEntity();
    entity.id = url.getId();
    entity.originalUrl = url.getOriginalUrl();
    entity.shortUrl = url.getShortUrl();
    entity.createdAt = url.getCreatedAt();
    entity.updatedAt = url.getUpdatedAt();
    entity.expiresAt = url.getExpiresAt();
    entity.createdBy = TypeOrmUserEntity.fromDomain(url.getCreatedBy());
    return entity;
  }

  toDomain(): Url {
    return new Url(
      this.shortUrl,
      this.originalUrl,
      this.createdBy.toDomain(),
      this.expiresAt || undefined,
      this.id,
    );
  }
}
