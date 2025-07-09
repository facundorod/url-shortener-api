import { User } from './user.entity';

export class Url {
  private id: number;
  private shortUrl: string;
  private originalUrl: string;
  private createdBy: User;
  private createdAt: Date;
  private updatedAt: Date;
  private expiresAt?: Date;

  constructor(
    shortUrl: string,
    originalUrl: string,
    createdBy: User,
    expiresAt?: Date,
    id?: number,
  ) {
    this.shortUrl = shortUrl;
    this.originalUrl = originalUrl;
    this.createdBy = createdBy;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.expiresAt = expiresAt;
    if (id) {
      this.id = id;
    }
  }

  getId(): number {
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

  getExpiresAt(): Date | undefined {
    return this.expiresAt;
  }

  setExpiresAt(expiresAt: Date) {
    this.expiresAt = expiresAt;
  }
}
