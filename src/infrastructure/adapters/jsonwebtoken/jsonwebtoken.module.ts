import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationAdapter } from '@/infrastructure/configuration/configuration.adapter';
import { JsonWebTokenAdapter } from './jsonwebtoken.adapter';
import { ConfigurationModule } from '@/infrastructure/configuration/configuration.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationAdapter],
      useFactory: (configService: ConfigurationAdapter) => ({
        secret: configService.getJwtSecret(),
        signOptions: {
          expiresIn: configService.getJwtExpiresIn(),
          algorithm: 'HS256',
        },
      }),
    }),
  ],
  providers: [JsonWebTokenAdapter],
  exports: [JsonWebTokenAdapter],
})
export class JsonwebtokenModule {}
