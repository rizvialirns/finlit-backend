import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
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
    
  }
  
  export class RoleFillableFields {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    gender: string;
    username: string;
  }
  