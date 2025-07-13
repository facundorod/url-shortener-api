import { User } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/ports/userRepository.port';
import { RegisterUserDto } from '@/domain/dtos/registerUser.dto';
import { HashService } from '@/domain/ports/hashService.port';

export class RegisterUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async execute(user: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await this.hashService.hash(user.password);
    const newUser = new User(null, user.name, user.email, hashedPassword);
    return this.userRepository.create(newUser);
  }
}
