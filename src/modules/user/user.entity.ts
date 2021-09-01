import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Course } from '../course/course.entity';
import { Goal } from '../goal/goal.entity';
import { PasswordTransformer } from './password.transformer';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  username: string;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  password: string;

  @Column({
    type: 'enum',
    default: 'Male',
    name: 'gender',
    enum: ['Male','Female','Other']
  })
  gender: string;

  @ManyToMany(() => Role, role => role.users, { eager: true, cascade: true })
  @JoinTable({ name: 'users_roles' })
  public roles: Role[];
  
  @OneToMany(() => Course, course => course.creator)
  public courses: Course[];

  @OneToMany(() => Goal, goal => goal.creator)
  public goals: Goal[];

  toJSON() {
    const { password, ...self } = this;
    return self;
  }
}

export class UserFillableFields {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
