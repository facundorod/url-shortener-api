import { RegisterUserDto } from '@/domain/dtos/registerUser.dto';
import { RegisterUsecase } from '@/usecases/auth/register.usecase';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UsecasesProxyModule } from '@/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@/infrastructure/usecases-proxy/usecases.proxy';
import { LoginUsecase } from '@/usecases/auth/login.usecase';
import { LoginUserDto } from '@/domain/dtos/loginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.REGISTER_USER_USECASE)
    private readonly registerUserUsecase: UseCaseProxy<RegisterUsecase>,
    @Inject(UsecasesProxyModule.LOGIN_USER_USECASE)
    private readonly loginUserUsecase: UseCaseProxy<LoginUsecase>,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const result = await this.registerUserUsecase
      .getInstance()
      .execute(registerUserDto);
    return result;
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.loginUserUsecase
      .getInstance()
      .execute(loginUserDto.email, loginUserDto.password);
    return { token: result };
  }
}
