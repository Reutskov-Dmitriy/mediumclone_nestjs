import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('users')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any> {
    console.log('createDto', createUserDto)
    return await this.userService.createUser(createUserDto)
  }

  @Get()
  async getAllUsers() {
    return 'users'
  }
}