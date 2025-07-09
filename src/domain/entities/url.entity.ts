import { User } from './user.entity';

export class Url {
  private id: string;
  private shortUrl: string;
  private originalUrl: string;
  private createdBy: User;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(shortUrl: string, originalUrl: string, createdBy: User) {
    this.shortUrl = shortUrl;
    this.originalUrl = originalUrl;
    this.createdBy = createdBy;
  }

  setId(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  getShortUrl(): string {
    return this.shortUrl;
  }

  getOriginalUrl(): string {
    return this.originalUrl;
  }

  getCreatedBy(): User {
    return this.createdBy;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
