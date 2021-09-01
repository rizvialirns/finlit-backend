import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lecture } from './lecture.entity';
import { CourseService } from '../course/course.service';

@Injectable()
export class LectureService {

    constructor(
        @InjectRepository(Lecture)
        private readonly lectureRepository: Repository<Lecture>,
        private readonly courseService: CourseService,
      ) {}

    public async find(cId: number): Promise<Lecture[]> {
        const course = await this.courseService.validateCourse(cId);
        if(course.length === 0){
            throw new NotFoundException(
                'Course Not Found .',
              );
        }
        return this.lectureRepository.find({course: course[0]});
    }

    public async findOne(cId: number, id: number): Promise<Lecture> {
        const course = await this.courseService.validateCourse(cId);
        if(course.length === 0){
            throw new NotFoundException(
                'Course Not Found .',
              );
        }
        return this.lectureRepository.findOne({id,course: course[0]});
    }

    public async create(lecture: Lecture): Promise<Lecture> {
         return this.lectureRepository.save(lecture);
    }

    public async update(id: number, lecture: Lecture): Promise<Lecture> {
        lecture.id = id;
        return this.lectureRepository.save(lecture);
    }

    public async delete(id: string): Promise<void> {
        await this.lectureRepository.delete(id);
        return;
    }

}
