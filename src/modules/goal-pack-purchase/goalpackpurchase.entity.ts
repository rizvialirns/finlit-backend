import { IsNotEmpty } from 'class-validator';
import {Column, Entity, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {User} from '../user/user.entity';
// import { Goal } from '../goal/goal.entity';
@Entity()
export class GoalPackPurchase {

    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Column({type: 'timestamptz'})
    public purchaseDate: Date;

    @IsNotEmpty()
    @Column({type: 'timestamptz'})
    public purchaseTime: Date;

    @IsNotEmpty()
    @Column()
    public hasDiscount: boolean;

    @IsNotEmpty()
    @Column()
    public totalAmount: number;

    @IsNotEmpty()
    @Column()
    public totalDiscount: number;

    @OneToMany(() => User, buyer => buyer.id)
    public  buyers: User[];

}
