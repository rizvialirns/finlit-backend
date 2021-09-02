import { IsNotEmpty } from 'class-validator';
import {Column, Entity, JoinColumn, OneToOne, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Course} from '../course/course.entity';
import {CourseLevel} from '../course-level/courselevel.entity';


@Entity({name: 'lectures'})
export class Lecture {

    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Column()
    public lectureTitle: string;

    @IsNotEmpty()
    @Column()
    public lectureDescription: string;

    @IsNotEmpty()
    @Column()
    public isDeleted: boolean;

    @IsNotEmpty()
    @Column()
    public lectureVideo: string;

    @OneToOne(() => Course, { primary: true, cascade: true })
    @JoinColumn({ name: 'id' })
    public course: Course;

    @ManyToOne(() => CourseLevel, level => level.lectures)
    public  level: CourseLevel;
}
