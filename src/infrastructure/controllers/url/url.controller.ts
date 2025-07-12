import { CreateUrlDto } from '@/domain/dtos/createUrl.dto';
import { CreateUrlUsecase } from '@/usecases/urls/createUrl.usecase';
import { UseCaseProxy } from '@/infrastructure/usecases-proxy/usecases.proxy';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { UsecasesProxyModule } from '@/infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateUrlExpirationIsNotInThePast } from '@/infrastructure/pipes/validation/isNotInThePast.pipe';
import { GetUrlsUsecase } from '@/usecases/urls/getUrls.usecase';

@Controller('urls')
export class UrlController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_URL_USECASE)
    private readonly createUrlUseCase: UseCaseProxy<CreateUrlUsecase>,
    @Inject(UsecasesProxyModule.GET_URLS_USECASE)
    private readonly getUrlsUseCase: UseCaseProxy<GetUrlsUsecase>,
  ) {}

  @Post('')
  @UsePipes(new CreateUrlExpirationIsNotInThePast())
  createUrl(@Body() createUrlDto: CreateUrlDto) {
    const useCaseInstance = this.createUrlUseCase.getInstance();
    return useCaseInstance.execute(createUrlDto, 1);
  }

  @Get('')
  getUrls(@Req() req: Request) {
    const useCaseInstance = this.getUrlsUseCase.getInstance();
    return useCaseInstance.execute(1);
  }
}
