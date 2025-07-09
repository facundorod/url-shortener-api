import { CreateUrlDto } from '@/domain/dtos/createUrl.dto';
import { CreateUrlUsecase } from '@/usecases/urls/createUrl.usecase';
import { UseCaseProxy } from '@/infrastructure/usecases-proxy/usecases.proxy';
import {
  Body,
  Controller,
  Inject,
  Get,
  Post,
  UsePipes,
  BadRequestException,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UsecasesProxyModule } from '@/infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateUrlExpirationIsNotInThePast } from '@/infrastructure/pipes/validation/isNotInThePast.pipe';
import { GetUrlUsecase } from '@/usecases/urls/getUrl.usecase';
import { IsValidUrl } from '@/infrastructure/pipes/validation/isValidUrl.pipe';

@Controller('urls')
export class UrlController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_URL_USECASE)
    private readonly createUrlUseCase: UseCaseProxy<CreateUrlUsecase>,
    @Inject(UsecasesProxyModule.GET_URL_USECASE)
    private readonly getUrlUseCase: UseCaseProxy<GetUrlUsecase>,
  ) {}

  @Post('')
  @UsePipes(new CreateUrlExpirationIsNotInThePast())
  createUrl(@Body() createUrlDto: CreateUrlDto) {
    const useCaseInstance = this.createUrlUseCase.getInstance();
    return useCaseInstance.execute(createUrlDto, 1);
  }

  @Get('')
  @HttpCode(HttpStatus.TEMPORARY_REDIRECT)
  async getUrl(
    @Query('shortUrl', new IsValidUrl()) shortUrl: string,
  ): Promise<string> {
    const useCaseInstance = this.getUrlUseCase.getInstance();

    if (!shortUrl) {
      throw new BadRequestException('Original URL is required');
    }

    const originalUrl = await useCaseInstance.execute(shortUrl);

    return originalUrl;
  }
}
