/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordInput {
  // @IsString()
  // token: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  oldPassword: string;


}