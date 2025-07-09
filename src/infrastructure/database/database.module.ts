import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationAdapter } from '../configuration/configuration.adapter';
import { TypeOrmUserEntity } from './entities/user.entity';
import { TypeOrmUrlEntity } from './entities/url.entity';
import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationAdapter],
      useFactory: (config: ConfigurationAdapter) => ({
        type: 'postgres',
        url: config.getDatabaseUrl(),
        synchronize: config.getAppEnv() !== 'production',
        entities: [TypeOrmUserEntity, TypeOrmUrlEntity],
      }),
    }),
  ],
})
export class DatabaseModule {}
