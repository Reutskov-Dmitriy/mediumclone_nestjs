import { Controller, Post, Get, Body, UsePipes, Req, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseInterface } from './dto/userResponse.interface';
import LoginUserDto from './dto/loginUser.dto';
import { Request } from 'express';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';

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

  @Get('user')
  async getCurrentUser(@Req() request: ExpressRequestInterface): Promise<UserResponseInterface> {
    console.log('user', request.user);

    return this.userService.buildUserResponse(request.user);
  }

  @Get()
  async getAllUsers() {
    return 'users'
  }
}