import { UserRepository } from '@/domain/ports/userRepository.port';
import { User } from '@/domain/entities/user.entity';
import { RegisterUsecase } from '../register.usecase';
import { HashService } from '@/domain/ports/hashService.port';
import { RegisterUserDto } from '@/domain/dtos/registerUser.dto';

describe('RegisterUsecase', () => {
  let registerUsecase: RegisterUsecase;
  let userRepository: jest.Mocked<UserRepository>;
  let hashService: jest.Mocked<HashService>;
  let hashServiceSpy: jest.SpyInstance;
  let userRepositorySpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    hashService = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
    registerUsecase = new RegisterUsecase(userRepository, hashService);
  });

  it('should create a new user', async () => {
    const user: RegisterUserDto = {
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    };
    const expectedUser = new User(
      null,
      user.name,
      user.email,
      'hashedPassword',
    );
    userRepositorySpy = jest.spyOn(userRepository, 'findByEmail');
    userRepository.findByEmail.mockResolvedValueOnce(null);
    hashServiceSpy = jest.spyOn(hashService, 'hash');
    hashService.hash.mockResolvedValueOnce('hashedPassword');
    userRepositorySpy = jest.spyOn(userRepository, 'create');
    userRepository.create.mockResolvedValueOnce(expectedUser);

    userRepository.create.mockResolvedValueOnce(expectedUser);

    const createdUser = await registerUsecase.execute(user);
    expect(createdUser).toEqual(expectedUser);
    expect(hashServiceSpy).toHaveBeenCalledWith(user.password);
    expect(userRepositorySpy).toHaveBeenCalledWith(expectedUser);
  });

  it('should throw an error if the user already exists', async () => {
    const user: RegisterUserDto = {
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    };
    userRepositorySpy = jest.spyOn(userRepository, 'findByEmail');
    userRepository.findByEmail.mockResolvedValueOnce(
      new User(1, user.name, user.email, 'hashedPassword'),
    );
    await expect(registerUsecase.execute(user)).rejects.toThrow(
      'User already exists',
    );
  });
});
