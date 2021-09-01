import { IsNotEmpty } from 'class-validator';
import {Column, Entity, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {User} from '../user/user.entity';
import { GoalPackCourses } from '../goalpackcourses/goalpackcourses.entity';
@Entity()
export class Goal {

    @PrimaryGeneratedColumn()
    public id: string;

    @IsNotEmpty()
    @Column()
    public goalName: string;

    @IsNotEmpty()
    @Column()
    public goalDescription: string;

    @IsNotEmpty()
    @Column()
    public goalImage: string;

    @IsNotEmpty()
    @Column()
    public originalPrice: number;

    @IsNotEmpty()
    @Column()
    public onSale: boolean;

    @IsNotEmpty()
    @Column()
    public discountPercent: number;

    @IsNotEmpty()
    @Column({type: 'jsonb'})
    public skills: string[];

    @ManyToOne(() => GoalPackCourses, goalPackCourses => goalPackCourses.goals)
    public  goalPackCourses: GoalPackCourses;

    @ManyToOne(() => User, creator => creator.goals)
    public  creator: User;
}
