import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Goal } from './goal.entity';
import { GoalPackCourses } from '../goal-pack-courses/goalpackcourses.entity';
import { Course } from '../course/course.entity';
import { CourseService } from '../course/course.service';
import { UsersService } from '../user/user.service';

@Injectable()
export class GoalService {

    constructor(
        @InjectRepository(Goal)
        private readonly goalRepository: Repository<Goal>,
        @InjectRepository(GoalPackCourses)
        private readonly goalPackCoursesRepository: Repository<GoalPackCourses>,
        private courseService: CourseService,
        private userService: UsersService,

    ) { }

    public async find(req: any): Promise<Goal[]> {
        const creator = await this.userService.get(req.user.id);
        if (!creator) {
            return undefined;
        }
        return this.goalRepository.find({creator});
    }

    public async findOne(req: any, id: string): Promise<Goal> {
        const creator = await this.userService.get(req.user.id);
        if (!creator) {
            return undefined;
        }
        return this.goalRepository.findOne({creator, id});
    }

    public async validateGoal(body: any): Promise<Course[]> {
        let courseCheck = true;
        const courseObjs: Course[] = new Array();
        for (const courseid of body.courses) {
          const resArr = await this.courseService.validateCourse(courseid);
          if (resArr.length === 0) {
            courseCheck = false;
          }
          courseObjs.push(resArr[0]);
        }
        if (courseCheck) {
            return courseObjs;
        } else {
            return [];
        }
    }

    public async findGoalCourses(id: number): Promise<Goal> {
        return this.goalRepository.findOne({
            relations: ['goalPackCourses'],
            where:{id}
        });
    }

    public async create(user: any, goal: Goal, courses: Course[]): Promise<Goal | undefined> {
        const creator = await this.userService.get(user.id);
        if (!creator) {
            return undefined;
        }
        goal.creator = creator;
        const newGoal = await this.goalRepository.save(goal);
        if (!newGoal) { return undefined; }
        const goalPackCourses = new GoalPackCourses();
        goalPackCourses.courses = courses;
        goalPackCourses.goals = [newGoal];
        const newGoalPackCourses = await this.goalPackCoursesRepository.save(goalPackCourses);
        if (!newGoalPackCourses) {
            await this.goalRepository.delete(newGoal.id);
            return undefined;
        }
        return  newGoal;
    }

    public async update(id: string , goal: Goal, courses: Course[]): Promise<Goal | undefined> {
        goal.id = id;
        const newGoal = await this.goalRepository.save(goal);
        if (!newGoal) { return undefined; }
        const prevGoalPackCourses = await this.goalPackCoursesRepository.findOne({goals: [goal]});
        const newGoalPackCourses = new GoalPackCourses();
        newGoalPackCourses.id = prevGoalPackCourses.id;
        newGoalPackCourses.courses = courses;
        newGoalPackCourses.goals = [newGoal];
        const updtGoalPackCourses = await this.goalPackCoursesRepository.save(newGoalPackCourses);
        if (!updtGoalPackCourses) {
            await this.goalRepository.delete(newGoal.id);
            return undefined;
        }
        return newGoal;
    }
    public async updateGoalImage(goal: Goal): Promise<Goal> {
        return await this.goalRepository.save(goal);
    }
    public async delete(id: string): Promise<void> {
        const goal = await this.goalRepository.findOne({id});
        await this.goalPackCoursesRepository.delete({goals: [goal]});
        await this.goalRepository.delete(id);
        return;
    }

}
