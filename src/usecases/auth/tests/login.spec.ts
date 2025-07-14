import { UserRepository } from '@/domain/ports/userRepository.port';
import { User } from '@/domain/entities/user.entity';
import { LoginUsecase } from '../login.usecase';
import { HashService } from '@/domain/ports/hashService.port';
import { EncrypterService } from '@/domain/ports/envrypterService.port';
import { UserNotExist } from '@/domain/errors/userNotExist.error';

describe('LoginUsecase', () => {
  let loginUsecase: LoginUsecase;
  let userRepository: jest.Mocked<UserRepository>;
  let hashService: jest.Mocked<HashService>;
  let encrypterService: jest.Mocked<EncrypterService>;
  let hashServiceSpy: jest.SpyInstance;
  let encrypterServiceSpy: jest.SpyInstance;

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
    encrypterService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };
    loginUsecase = new LoginUsecase(
      encrypterService,
      userRepository,
      hashService,
    );
  });

  it('should login a user', async () => {
    const user = new User(1, 'test', 'test@test.com', 'hashedPassword');
    userRepository.findByEmail.mockResolvedValueOnce(user);
    hashServiceSpy = jest.spyOn(hashService, 'compare');
    hashService.compare.mockResolvedValueOnce(true);
    encrypterServiceSpy = jest.spyOn(encrypterService, 'sign');
    encrypterService.sign.mockResolvedValueOnce('token');

    const token = await loginUsecase.execute(
      user.getEmail(),
      user.getPassword(),
    );
    expect(token).toEqual('token');
    expect(hashServiceSpy).toHaveBeenCalledWith(
      user.getPassword(),
      'hashedPassword',
    );
    expect(encrypterServiceSpy).toHaveBeenCalledWith({
      id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
    });
  });

  it('should throw an error if the user does not exist', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(null);
    await expect(loginUsecase.execute('test@test.com', 'test')).rejects.toThrow(
      UserNotExist,
    );
  });
});
