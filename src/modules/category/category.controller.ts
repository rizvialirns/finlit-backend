import { IsNotEmpty,IsEmail, IsInt } from 'class-validator';
import { Body, Controller, Get, Post, UseGuards, Req, Param, Put, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category, CategoryService } from './../category'
import {fileUploadOptions} from 'utils/multer/multer.config'
import path from 'path';

class BaseCategory {
    @IsNotEmpty()
    public categoryName: string;
    
    @IsNotEmpty()
    public categoryImage: string;
    
    @IsNotEmpty()
    public parentId: string;
}

@ApiBearerAuth()
@Controller('api/category')
@UseGuards(AuthGuard())
@ApiTags('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public find(): Promise<Category[]> {
    return this.categoryService.find();
}

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public one(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOne(id);
}


  @Post()
  @ApiResponse({ status: 201, description: 'Successful Creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public create(@Req() req: any, @Body() body: BaseCategory): Promise<Category> {
    const category = new Category();
    category.categoryName = body.categoryName;
    category.parentId = body.parentId;
    return this.categoryService.create(category);
 }

 @Post('/uploadMedia/:catId')
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
 public saveUploaded(@Param('catId') catId: number, @UploadedFile() file: any): Promise<Category> {
     const category = new Category();
     category.categoryImage = file.path;
     return this.categoryService.update(catId, category);
 } 


  @Put(':id')
  @ApiResponse({ status: 201, description: 'Successful Updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public update(@Param('id') id: number, @Body() body: BaseCategory): Promise<Category> {
    const category = new Category();
    category.categoryName = body.categoryName;
    category.parentId = body.parentId;
    return this.categoryService.update(id, category);
}

  @Delete(':id')
  public delete(@Param('id') id: number): Promise<void> {
    return this.categoryService.delete(id);
  }
}
