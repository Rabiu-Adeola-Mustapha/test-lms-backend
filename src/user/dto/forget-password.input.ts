/* eslint-disable prettier/prettier */
import { IsEmail,IsNotEmpty } from 'class-validator';

export class ForgetPasswordInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}