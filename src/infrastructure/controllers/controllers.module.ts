import { Module } from '@nestjs/common';
import { UrlController } from './url/url.controller';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { UrlRedirectController } from './url/url-redirect.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  controllers: [UrlController, UrlRedirectController, AuthController],
  imports: [UsecasesProxyModule.register()],
})
export class ControllersModule {}
