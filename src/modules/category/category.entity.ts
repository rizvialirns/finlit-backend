import { IsNotEmpty } from 'class-validator';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
@Entity({name: 'categories'})
export class Category {

    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Column({length: 255})
    public categoryName: string;

    @Column()
    public categoryImage: string;

    @Column()
    public parentId: string;
}
