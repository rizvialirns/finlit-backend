import { IsNotEmpty,IsEmail, IsInt } from 'class-validator';
import { Body, Controller, Get, Post, UseGuards, Req, Param, Put, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Goal, GoalService } from './../goal'
import { Course } from './../course'
import {fileUploadOptions} from 'utils/multer/multer.config'
import path from 'path';


class BaseGoal {
    @IsNotEmpty()
    public goalName: string;

    @IsNotEmpty()
    public goalDescription: string;

    @IsNotEmpty()
    public goalImage: string;

    @IsNotEmpty()
    public originalPrice: number;

    @IsNotEmpty()
    public onSale: boolean;

    @IsNotEmpty()
    public discountPercent: number;

    @IsNotEmpty()
    public skills: string[];

    @IsNotEmpty()
    public courses: string[];
}

@ApiBearerAuth()
@Controller('api/goal')
@UseGuards(AuthGuard())
@ApiTags('goal')
export class GoalController {
  constructor(
    private readonly goalService: GoalService
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public find(@Req() req: any): Promise<Goal[]> {
    return this.goalService.find(req);
}

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not FOund' })
  public findOne(@Req() req: any, @Param('id') id: number): Promise<Goal> {
    return this.goalService.findOne(req , id);
}

@Get(':id/courses')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not FOund' })
  public async findGoalCourses(@Param('id') id: number): Promise<Goal> {
    const goalPackCourse = await this.goalService.findGoalCourses(id);
    if (!goalPackCourse) {
        return undefined;
    } else {
        return goalPackCourse;
    }
}

@Post('uploadMedia/:goalId')
@UseInterceptors(FileInterceptor('file',{
    storage: fileUploadOptions.storage,
    fileFilter: (req: any, file: any, callback) => {
     const ext = path.extname(file.originalname);
     if (ext !== '.jpg') {
         return callback(new Error('Only images are allowed'),false);
     }
     callback(undefined, true);
 },
 limits: {fileSize : 2000000 },
  }))
public saveUploaded(@Param('goalId') goalId: number, @UploadedFile() file: any): Promise<Goal> {
        const goal = new Goal();
        goal.id = goalId;
        goal.goalImage = file.path;
        return this.goalService.updateGoalImage(goal);
    }


  @Post()
  @ApiResponse({ status: 201, description: 'Successful Creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not FOund' })
  public async create(@Req() req: any, @Body() body: BaseGoal): Promise<Goal> {
    const user = req.auth.user;
    const goal = new Goal();
    const validatedCourses = await this.goalService.validateGoal(body);
    if (validatedCourses.length !== 0) {
        goal.goalName = body.goalName;
        goal.goalDescription = body.goalDescription;
        goal.originalPrice = body.originalPrice;
        goal.skills = body.skills;
        goal.onSale = body.onSale;
        goal.discountPercent = body.discountPercent;
        return this.goalService.create(user, goal, validatedCourses);
    } else {
        return undefined;
    }
}

  @Put(':id')
  @ApiResponse({ status: 201, description: 'Successful Updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async update(@Param('id') id: number, @Body() body: BaseGoal): Promise<Goal> {
    const goal = new Goal();
    const validatedCourses = await this.goalService.validateGoal(body);
    if (validatedCourses.length !== 0) {
        goal.goalName = body.goalName;
        goal.goalDescription = body.goalDescription;
        goal.originalPrice = body.originalPrice;
        goal.skills = body.skills;
        goal.onSale = body.onSale;
        goal.discountPercent = body.discountPercent;
        return this.goalService.update(id, goal, validatedCourses);
    } else {
        return undefined;
    }
}


  @Delete(':id')
  public delete(@Param('id') id: number): Promise<void> {
    return this.goalService.delete(id);
}
}
