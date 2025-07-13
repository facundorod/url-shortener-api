import { Module } from '@nestjs/common';
import { BCryptService } from './bcrypt.adapter';
import { ConfigurationService } from '@/domain/ports/configurationService.port';
import { ConfigurationAdapter } from '@/infrastructure/configuration/configuration.adapter';
import { ConfigurationModule } from '@/infrastructure/configuration/configuration.module';

@Module({
  imports: [ConfigurationModule],
  providers: [
    {
      provide: BCryptService,
      useFactory: (configService: ConfigurationService) =>
        new BCryptService(configService),
      inject: [ConfigurationAdapter],
    },
  ],
  exports: [BCryptService],
})
export class BcryptModule {}
