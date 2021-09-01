import { IsNotEmpty } from 'class-validator';
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import {User} from '../user/user.entity';
import {Lecture} from '../lecture/lecture.entity';
import {Category} from '../category/category.entity';
import {GoalPackCourses} from '../goal-pack-courses/goalpackcourses.entity';
export enum CourseLevelEnum {
    Beginner='Beginner',
    Intermediate='Intermediate',
    Advanced='Advanced',
    Expert='Expert',
}
@Entity({
    name: 'courses',
  })
export class Course {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column()
    public mainTitle: string;

    @IsNotEmpty()
    @Column()
    public subTitle: string;

    @IsNotEmpty()
    @Column()
    public description: string;

    @IsNotEmpty()
    @Column()
    public publishStatus: boolean;

    @IsNotEmpty()
    @Column()
    public promotionalVideo: string;

    @IsNotEmpty()
    @Column()
    public image: string;

    @IsNotEmpty()
    @Column()
    public courseLanguage: string;

    @IsNotEmpty()
    @Column({
        type:'enum',
        default: CourseLevelEnum.Beginner,
        enum: CourseLevelEnum
    })
    public courseLevel: string;

    @IsNotEmpty()
    @Column()
    public price: number;

    @IsNotEmpty()
    @Column()
    public welcomeMessage: string;

    @ManyToOne(() => User, creator => creator.courses)
    public  creator: User;

    @OneToMany(() => Lecture, lecture => lecture.course)
    public  lectures: Lecture[];

    @OneToOne(() => Category, { primary: true, cascade: true })
    @JoinColumn({ name: 'id' })
    public categoryId: Category;

    @ManyToOne(() => GoalPackCourses, goalPackCourses => goalPackCourses.courses)
    public  goalPackCourses: GoalPackCourses;

}
