import { UpdateUserDto } from './dto/updateUser.dto';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from './dto/userResponse.interface';
import { UserType } from './dto/user.type';
import LoginUserDto from './dto/loginUser.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {}
    }
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });
    const userByName = await this.userRepository.findOne({
      where: { name: createUserDto.name }
    });
    if (userByEmail) {
      errorResponse.errors['email'] = 'has already been taken'
    }
    if (userByName) {
      errorResponse.errors['name'] = 'has already been taken'
    }
    if (userByEmail || userByName) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }
  generateJwt(user: UserEntity): string {
    return sign({
      id: user.id,
      name: user.name,
      email: user.email,
    }, JWT_SECRET);
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }



  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: { 'email or password': 'is invalid' },
    }
    const userByEmail = await this.userRepository.findOne({
      where:
      {
        email: loginUserDto.email
      },
      select: ['id', 'name', 'email', 'bio', 'image', 'password'],
    });
    if (!userByEmail) {
      throw new HttpException(
        errorResponse,
        HttpStatus.UNPROCESSABLE_ENTITY,)
    }

    const isPasswordCorrect = await compare(loginUserDto.password, userByEmail.password)
    if (!isPasswordCorrect) {
      throw new HttpException(
        errorResponse,
        HttpStatus.UNPROCESSABLE_ENTITY,)
    }

    delete userByEmail.password;
    return userByEmail
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      }
    }
  }
}