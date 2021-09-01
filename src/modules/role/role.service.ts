import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './role.entity';

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
      ) {}

    public async find(): Promise<Role[]> {
        return this.roleRepository.find({ relations: ['users'] });
    }

    public async findOne(id: number): Promise<Role | undefined> {
        return this.roleRepository.findOne({ id });
    }

    public async create(role: Role): Promise<Role> {
        return this.roleRepository.save(role);
    }

    public async update(id: number, role: Role): Promise<Role> {
        role.id = id;
        return this.roleRepository.save(role);
    }

    public async delete(id: string): Promise<void> {
        await this.roleRepository.delete(id);
        return;
    }

}