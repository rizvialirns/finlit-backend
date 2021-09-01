import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './category.entity';


@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
      ) {}

    public async find(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    public async findOne(id: number): Promise<Category> {
        return this.categoryRepository.findOne({id});
    }

    public async create(category: Category): Promise<Category> {
        return this.categoryRepository.save(category);
    }

    public async update(id: number, category: Category): Promise<Category> {
        category.id = id;
        return this.categoryRepository.save(category);
    }

    public async delete(id: string): Promise<void> {
        await this.categoryRepository.delete(id);
        return;
    }

}
