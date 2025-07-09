import { CreateUrlDto } from '@/domain/dtos/createUrl.dto';
import { CreateUrlUsecase } from '@/usecases/createUrl.usecase';
import { UseCaseProxy } from '@/infrastructure/usecases-proxy/usecases.proxy';
import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import { UsecasesProxyModule } from '@/infrastructure/usecases-proxy/usecases-proxy.module';
import { CreateUrlExpirationIsNotInThePast } from '@/infrastructure/pipes/validation/isNotInThePast.pipe';

@Controller('urls')
export class UrlController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_URL_USECASE)
    private readonly createUrlUseCase: UseCaseProxy<CreateUrlUsecase>,
  ) {}

  @Post('')
  @UsePipes(new CreateUrlExpirationIsNotInThePast())
  createUrl(@Body() createUrlDto: CreateUrlDto) {
    const useCaseInstance = this.createUrlUseCase.getInstance();
    return useCaseInstance.execute(createUrlDto, 1);
  }
}
