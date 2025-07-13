import { Injectable } from '@nestjs/common';
import { EncrypterService } from '@/domain/ports/envrypterService.port';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JsonWebTokenAdapter implements EncrypterService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(key: object): Promise<string> {
    return this.jwtService.signAsync(key);
  }

  async verify(token: string): Promise<object> {
    return this.jwtService.verifyAsync(token);
  }
}
