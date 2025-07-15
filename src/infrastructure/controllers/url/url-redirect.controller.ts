import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsecasesProxyModule } from '@/infrastructure/usecases-proxy/usecases-proxy.module';
import { GetUrlUsecase } from '@/usecases/urls/getUrl.usecase';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UseCaseProxy } from '@/infrastructure/usecases-proxy/usecases.proxy';
import { Public } from '@/infrastructure/decorators/public.decorator';

@Controller('')
export class UrlRedirectController {
  constructor(
    @Inject(UsecasesProxyModule.GET_URL_USECASE)
    private readonly getUrlUseCase: UseCaseProxy<GetUrlUsecase>,
  ) {}

  @Get('/:id')
  @Public()
  async getUrl(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const useCaseInstance = this.getUrlUseCase.getInstance();

    if (!id) {
      throw new BadRequestException('URL ID is required');
    }

    try {
      const urlToRedirect = await useCaseInstance.execute(id);

      res.redirect(301, urlToRedirect);
    } catch {
      throw new NotFoundException('URL not found');
    }
  }
}
