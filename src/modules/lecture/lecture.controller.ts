import { IsNotEmpty,IsEmail, IsInt } from 'class-validator';
import { Body, Controller, Get, Post, UseGuards, Req, Param, Put, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Course, CourseService } from './../course'
import { Lecture, LectureService } from './../lecture'
import {fileUploadOptions} from 'utils/multer/multer.config'
import path from 'path';

class BaseLecture {
    @IsNotEmpty()
    public lectureTitle: string;

    @IsNotEmpty()
    public lectureDescription: string;

    @IsNotEmpty()
    public isDeleted: boolean;

    @IsNotEmpty()
    public lectureVideo: string;

    @IsNotEmpty()
    public courseId: number;
}


@ApiBearerAuth()
@Controller('api/lecture')
@UseGuards(AuthGuard())
@ApiTags('lecture')
export class LectureController {
  constructor(
    private readonly lectureService: LectureService,
    private readonly courseService: CourseService
  ) {}

  @Get(':cId')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public find(@Param('cId') cId: number): Promise<Lecture[]> {
    return this.lectureService.find(cId);
}

  @Get(':cId/:id')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public one(@Param('cId') cId: number, @Param('id') id: number): Promise<Lecture | undefined> {
    return this.lectureService.findOne(cId, id);
}


  @Post()
  @ApiResponse({ status: 201, description: 'Successful Creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async create(@Req() req: any, @Body() body: BaseLecture): Promise<Lecture> {
    const lecture = new Lecture();
    lecture.lectureTitle = body.lectureTitle;
    lecture.lectureDescription = body.lectureDescription;
    lecture.isDeleted = body.isDeleted;
    lecture.lectureVideo = body.lectureVideo;
    const courseObj = await this.courseService.findOne(req, body.courseId);
    if (courseObj === undefined) { return undefined; }
    lecture.course = courseObj;
    return this.lectureService.create(lecture);
}


@Post('uploadMedia/:lecId')
@UseInterceptors(FileInterceptor('file',{
  storage: fileUploadOptions.storage,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
        return callback(new Error('Only videos are allowed'),false);
    }
    callback(undefined, true);
},
}))
public saveUploaded(@Param('lecId') lecId: number, @UploadedFile() file: any): Promise<Lecture> {
    const lecture = new Lecture();
    lecture.lectureVideo = file.Path;
    return this.lectureService.update(lecId, lecture);
}

  @Put(':id')
  @ApiResponse({ status: 201, description: 'Successful Updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async update(@Req() req: any, @Param('id') id: number, @Body() body: BaseLecture): Promise<Lecture> {
    const lecture = new Lecture();
    lecture.lectureTitle = body.lectureTitle;
    lecture.lectureDescription = body.lectureDescription;
    lecture.isDeleted = body.isDeleted;
    lecture.lectureVideo = body.lectureVideo;
    const courseObj = await this.courseService.findOne(req, body.courseId);
    if (courseObj === undefined) { return undefined; }
    lecture.course = courseObj;

    return this.lectureService.update(id, lecture);
}

  @Delete(':id')
  public delete(@Param('id') id: string): Promise<void> {
    return this.lectureService.delete(id);
}
}
