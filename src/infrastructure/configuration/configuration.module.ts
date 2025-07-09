import { Module } from '@nestjs/common';
import { ConfigurationAdapter } from './configuration.adapter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [ConfigurationAdapter],
  exports: [ConfigurationAdapter],
})
export class ConfigurationModule {}
