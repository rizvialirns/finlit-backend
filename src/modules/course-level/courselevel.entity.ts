import { IsNotEmpty } from 'class-validator';
import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import {Course} from '../course/course.entity';
import { Lecture } from '../lecture/lecture.entity';
@Entity({name: 'course_levels'})
export class CourseLevel {

    @PrimaryGeneratedColumn()
    public id: string;

    @IsNotEmpty()
    @Column()
    public levelName: string;

    @IsNotEmpty()
    @Column()
    public approxTime: string;

    @ManyToOne(() => Course, course => course.levels)
    public  course: Course;

    @OneToMany(() => Lecture, lecture => lecture.level)
    public  lectures: Lecture[];
}
