import { IsNotEmpty,IsEmail, IsInt } from 'class-validator';
import { Body, Controller, Get, Post, UseGuards, Req, Param, Put, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role, RoleService } from './../role'
import {fileUploadOptions} from 'utils/multer/multer.config'
import multer from 'multer';
import path from 'path';


const uploadOptions = multer({
    storage: fileUploadOptions.storage,
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4' && ext !== '.jpg') {
            return callback(new Error('Only images/videos are allowed'));
        }
        callback(undefined, true);
    },
});

export enum CourseLevelEnum {
    Beginner='Beginner',
    Intermediate='Intermediate',
    Advanced='Advanced',
    Expert='Expert',
}

class BaseRole {
    @IsNotEmpty()
    public roleName: string;

    @IsNotEmpty()
    public description: string;
}

@ApiBearerAuth()
@Controller('api/role')
@UseGuards(AuthGuard())
@ApiTags('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public find(): Promise<Role[]> {
    return this.roleService.find();
}
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public one(@Param('id') id: number): Promise<Role> {
    return this.roleService.findOne(id);
}


  @Post()
  @ApiResponse({ status: 201, description: 'Successful Creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public create(@Body() body: BaseRole): Promise<Role> {
    const role = new Role();
    role.description = body.description;
    role.roleName = body.roleName;
    return this.roleService.create(role);
}

  @Put(':id')
  @ApiResponse({ status: 201, description: 'Successful Updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public update(@Param('id') id: number, @Body() body: BaseRole): Promise<Role> {
    const role = new Role();
    role.description = body.description;
    role.roleName = body.roleName;

    return this.roleService.update(id, role);
}

  @Delete(':id')
  public delete(@Param('id') id: string): Promise<void> {
    return this.roleService.delete(id);
}
}
