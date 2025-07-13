import { Injectable } from '@nestjs/common';
import { EncrypterService } from '@/domain/ports/envrypterService.port';
import { UserRepository } from '@/domain/ports/userRepository.port';
import { HashService } from '@/domain/ports/hashService.port';

@Injectable()
export class LoginUsecase {
  constructor(
    private readonly encrypterService: EncrypterService,
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await this.hashService.compare(
      password,
      user.getPassword(),
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token: string = await this.encrypterService.sign({
      id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
    });

    return token;
  }
}
