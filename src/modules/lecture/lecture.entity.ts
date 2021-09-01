import { IsNotEmpty } from 'class-validator';
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Course} from '../course/course.entity';

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

}
