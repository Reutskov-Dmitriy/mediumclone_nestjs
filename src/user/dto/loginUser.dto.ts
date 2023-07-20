import { IsEmail, IsNotEmpty } from 'class-validator';

export default class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}