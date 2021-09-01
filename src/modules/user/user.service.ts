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
    return this.userRepository.find();
  }

  public async get(id: number): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  public async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  public async create(payload: UserFillableFields): Promise<User> {
    const user = await this.getByEmail(payload.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }

    return this.userRepository.save(payload);
  }
}
