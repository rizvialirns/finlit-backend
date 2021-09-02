import { IsNotEmpty,IsEmail, IsInt } from 'class-validator';
import { Body, Controller, Get, Post, UseGuards, Req, Param, Put, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Course, CourseService } from './../course'
import {fileUploadOptions} from 'utils/multer/multer.config'
import path from 'path';

export enum CourseLevelEnum {
    Beginner='Beginner',
    Intermediate='Intermediate',
    Advanced='Advanced',
    Expert='Expert',
}

class BaseCourse {
    @IsNotEmpty()
    public mainTitle: string;

    @IsNotEmpty()
    public subTitle: string;

    @IsNotEmpty()
    public description: string;

    @IsNotEmpty()
    public publishStatus: boolean;

    @IsNotEmpty()
    public promotionalVideo: string;

    @IsNotEmpty()
    public image: string;

    @IsNotEmpty()
    public courseLanguage: string;

    @IsNotEmpty()
    @IsInt()
    public price: number;

    @IsNotEmpty()
    public welcomeMessage: string;

    @IsNotEmpty()
    @IsInt()
    public courseLevel: CourseLevelEnum;
}

@ApiBearerAuth()
@Controller('api/course')
@UseGuards(AuthGuard())
@ApiTags('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public find(@Req() req: any): Promise<Course[]> {
    return this.courseService.find(req);
}

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public one(@Req() req: any, @Param('id') id: number): Promise<Course | undefined> {
    return this.courseService.findOne(req, id);
}


  @Post()
  @ApiResponse({ status: 201, description: 'Successful Creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public create(@Req() req: any, @Body() body: BaseCourse): Promise<Course> {
    const course = new Course();
    course.mainTitle = body.mainTitle;
    course.subTitle = body.subTitle;
    course.description = body.description;
    course.publishStatus = body.publishStatus;
    course.promotionalVideo = body.promotionalVideo;
    course.image = body.image;
    course.courseLanguage = body.courseLanguage;
    course.courseLevel = body.courseLevel;
    course.price = body.price;
    course.welcomeMessage = body.welcomeMessage;
    course.creator = req.auth.user;

    return this.courseService.create(course);
}

@Post('uploadMedia/:cId')
@UseInterceptors(FileInterceptor('file',{
  storage: fileUploadOptions.storage,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4' && ext !== '.jpg') {
        return callback(new Error('Only images/videos are allowed'),false);
    }
    callback(undefined, true);
},
}))
public saveUploaded(@Req() req: any, @Param('cId') cId: number, @UploadedFile() file: any): Promise<Course> {
        const filetype: string = file.mimetype.split('/')[0];
        const course = new Course();
        if (filetype === 'image') {
            course.image = file.location;
        } else if (filetype === 'video') {
            course.promotionalVideo = file.location;
        }
        return this.courseService.update(cId, course);
    }

  @Put(':id')
  @ApiResponse({ status: 201, description: 'Successful Updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public update(@Param('id') id: number, @Body() body: BaseCourse): Promise<Course> {
    const course = new Course();
    course.mainTitle = body.mainTitle;
    course.subTitle = body.subTitle;
    course.description = body.description;
    course.publishStatus = body.publishStatus;
    course.promotionalVideo = body.promotionalVideo;
    course.image = body.image;
    course.courseLanguage = body.courseLanguage;
    course.courseLevel = body.courseLevel;
    course.price = body.price;
    course.welcomeMessage = body.welcomeMessage;

    return this.courseService.update(id, course);
}

  @Delete(':id')
  public delete(@Param('id') id: number): Promise<void> {
    return this.courseService.delete(id);
  }
}
