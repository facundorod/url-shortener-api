import { User } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/ports/userRepository.port';
import { TypeOrmUserEntity } from '@/infrastructure/database/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(TypeOrmUserEntity)
    private readonly userRepository: Repository<TypeOrmUserEntity>,
  ) {}

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    return user.toDomain();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;
    return user.toDomain();
  }

  async create(user: User): Promise<User> {
    const userEntity = TypeOrmUserEntity.fromDomain(user);
    const createdUser = await this.userRepository.save(userEntity);
    return createdUser.toDomain();
  }
}
