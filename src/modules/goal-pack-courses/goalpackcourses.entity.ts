import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {Goal} from '../goal/goal.entity';
import {Course} from '../course/course.entity';

@Entity()
export class GoalPackCourses {

    @PrimaryGeneratedColumn()
    public id: number;

    @OneToMany(() => Course, course => course.goalPackCourses)
    public  courses: Course[];

    @OneToMany(() => Goal, goal => goal.goalPackCourses)
    public  goals: Goal[];
}
