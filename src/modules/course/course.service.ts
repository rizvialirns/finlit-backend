import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from './course.entity';


@Injectable()
export class CourseService {

    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
      ) {}

    public async find(req: any): Promise<Course[]> {
        const creator = req.user;
        return this.courseRepository.find({creator});
    }

    public async validateCourse(courseId: number): Promise<Course[]> {
        return this.courseRepository.find({id: courseId});
    }

    public async findOne(req: any, id: number): Promise<Course | undefined> {
        const creator = req.user;
        return this.courseRepository.findOne({id, creator});
    }

    public async create(course: Course): Promise<Course> {
      return this.courseRepository.save(course);
    }

    public async update(id: number, course: Course): Promise<Course> {
        course.id = id;
        return this.courseRepository.save(course);
    }

    public async delete(id: number): Promise<void> {
        await this.courseRepository.delete(id);
        return;
    }

}
