import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserFillableFields } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
 public async getAll(): Promise<User[]> {
    return this.userRepository.find({
      relations:['roles'],
    });
  }

  public async get(id: number): Promise<User> {
    return this.userRepository.findOne({
      relations:['roles'],
      where: {id},
    });
  }

  public async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  public async create(newUser: User): Promise<User> {
    const user = await this.getByEmail(newUser.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }

    return this.userRepository.save(newUser);
  }

  public async update(id: number, newUser: User): Promise<User> {
    const user = await this.getByEmail(newUser.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    newUser.id = id;
    return this.userRepository.save(newUser);
  }
  public async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
    return;
  }
}
