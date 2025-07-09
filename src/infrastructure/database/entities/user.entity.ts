import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@/domain/entities/user.entity';
import { TypeOrmUrlEntity } from './url.entity';

@Entity('users')
export class TypeOrmUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TypeOrmUrlEntity, url => url.createdBy)
  urls: TypeOrmUrlEntity[];

  static fromDomain(user: User): TypeOrmUserEntity {
    const entity = new TypeOrmUserEntity();
    entity.id = user.getId();
    entity.name = user.getName();
    entity.email = user.getEmail();
    entity.password = user.getPassword();
    return entity;
  }

  toDomain(): User {
    return new User(this.id, this.name, this.email, this.password);
  }
}
