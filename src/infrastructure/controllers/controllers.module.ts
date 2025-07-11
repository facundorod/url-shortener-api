import { Module } from '@nestjs/common';
import { UrlController } from './url/url.controller';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';

@Module({
  controllers: [UrlController],
  imports: [UsecasesProxyModule.register()],
})
export class ControllersModule {}
