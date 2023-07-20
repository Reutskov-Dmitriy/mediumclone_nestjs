import { Controller, Post, Get, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { UserResponseInterface } from './dto/userResponse.interface';
import LoginUserDto from './dto/loginUser.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto
  ): Promise<UserResponseInterface> {

    const user = await this.userService.login(loginUserDto)
    return this.userService.buildUserResponse(user)
  }

  @Get()
  async getAllUsers() {
    return 'users'
  }
}