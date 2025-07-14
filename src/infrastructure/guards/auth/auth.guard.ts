import { UnauthorizedUser } from '@/domain/errors/unauthorizedUser.error';
import { EncrypterService } from '@/domain/ports/envrypterService.port';
import { IS_PUBLIC_KEY } from '@/infrastructure/decorators/public.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private encrypterService: EncrypterService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    if (!token) {
      throw new UnauthorizedUser();
    }

    try {
      const payload: object = await this.encrypterService.verify(token);
      console.log(payload);
      request['user'] = payload;
      console.log('payload', payload);
    } catch {
      throw new UnauthorizedUser();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
