import { IsNotEmpty,IsEmail, IsInt } from 'class-validator';
import { Body, Controller, Get, Post, UseGuards, Req, Param, Put, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User, UsersService } from './../user';
import { CurrentUser } from 'modules/common/decorator/current-user.decorator';

class BaseUser {
  @IsNotEmpty()
  public firstName: string;

  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public username: string;

  @IsNotEmpty()
  public gender: string;
}

export class UserResponse extends BaseUser {
  @IsInt()
  public id: string;
}

class CreateUserBody extends BaseUser {
  @IsNotEmpty()
  public password: string;
}


@ApiBearerAuth()
@Controller('api/user')
@UseGuards(AuthGuard())
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UsersService
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async get(@Param('id') id: number): Promise<User> {
    return this.userService.get(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful Creation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async create(@Body() payload: CreateUserBody): Promise<User> {
    const user = new  User();
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;
    user.password = payload.password;
    return this.userService.create(user);
  }

  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Put(':id')
  @ApiResponse({ status: 201, description: 'Successful Updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async update(@Param('id') id: number, @Body() payload: CreateUserBody): Promise<User> {
    const user = new  User();
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;
    user.password = payload.password;
    return this.userService.update(id,user);
  }

  @Delete(':id')
  public delete(@Param('id') id: string): Promise<void> {
    const numId = Number(id);
    return this.userService.delete(numId);
  }
}
