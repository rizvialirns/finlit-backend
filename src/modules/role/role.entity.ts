import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable
  } from 'typeorm';
  import { User } from '../user/user.entity';

  @Entity({
    name: 'roles',
  })
  export class Role {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 255 })
    roleName: string;
  
    @Column({ length: 255 })
    description: string;

    @ManyToMany(() => User, user => user.roles)
    @JoinTable({ name: 'users_roles' })
    public users: User[];
    
  }
  
  export class RoleFillableFields {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    gender: string;
    username: string;
  }
  