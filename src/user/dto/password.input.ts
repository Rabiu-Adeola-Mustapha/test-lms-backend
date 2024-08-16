/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PasswordInput {

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  newPassword: string;

}