import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserEntity } from '@/infrastructure/database/entities/user.entity';
import { TypeOrmUrlEntity } from '@/infrastructure/database/entities/url.entity';
import { TypeOrmUserRepository } from './user.repository';
import { TypeOrmUrlRepository } from './url.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmUserEntity, TypeOrmUrlEntity])],
  providers: [TypeOrmUserRepository, TypeOrmUrlRepository],
  exports: [TypeOrmUserRepository, TypeOrmUrlRepository],
})
export class RepositoriesModule {}
