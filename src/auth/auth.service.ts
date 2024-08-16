/* eslint-disable prettier/prettier */
import {  Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import {  Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
// import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  // Login
  async login(users: User, response?: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow('JWT_EXPIRATION'),
    );

    const tokenPayload: TokenPayload = {
      _id: users._id.toHexString(),
      email: users.email,
      userName: users.userName,
      firstName : users.firstNname,
      lastName: users.lastNname,
      phone:  users.phone,
      gender: users.gender,
      address: users.address,
      city: users.city,
      state: users.state
    };

    const token = this.jwtService.sign(tokenPayload);

     if (response) {

        response.header('Authorization', `Bearer ${token}`).json({
          status: true,
          token,
        });

     }

      return token;
  }

  // Logout
  async logout(response: Response) {
    response.header('Authorization', '').json({
      status: true,
      message: 'Successfully logged out',
    });
  }



  // Validate google Ouath Login
  async validateOAuthLogin(user: any, provider: string): Promise<User> {
    const { email } = user;
    let existingUser = await this.userRepository.findOne({ email });

    if (!existingUser) {
      existingUser = new User();
      existingUser.email = email;
      existingUser.firstName = user.firstName;
      existingUser.lastName = user.lastName;
      existingUser.authProvider = provider;
      existingUser = await this.userRepository.save(existingUser);
    }

    return existingUser;
  }

  // async validateOAuthLogin(user: any): Promise<string> {
  //   // Find or create user in the database based on OAuth profile
  //   let existingUser = await this.userRepository.findOne({ email: user.email });

  //   if (!existingUser) {
  //     existingUser = new User();
  //     existingUser.email = user.email;
  //     existingUser.firstName = user.firstName;
  //     existingUser.lastName = user.lastName;
  //     existingUser.picture = user.picture;
  //     await this.userRepository.save(existingUser);
  //   }

  //   const payload: TokenPayload = {
  //     _id: existingUser._id.toHexString(),
  //     email: existingUser.email,
  //   };

  //   return this.jwtService.sign(payload);
  // }

  // async googleLogin(req) {
  //   if (!req.user) {
  //     return 'No user from google';
  //   }

  //   return {
  //     message: 'User information from google',
  //     user: req.user,
  //   };

  // Otp confimation
  async confirmRegOTP(email: string, otp: string): Promise<User> {
    try {
      let existinguser = await this.userRepository.findOne({ email });
      console.log('real-User:', existinguser.userName);
      if (!existinguser) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      if (existinguser.regOTP !== otp) {
        throw new UnauthorizedException('OTP is not valid.');
      }

      console.log('Real-user_status:', existinguser.regOTPConfirmed);
      // eslint-disable-next-line prefer-const

      //user.regOTPConfirmed = true;
      existinguser = await this.userRepository.findOneAndUpdate(
        { email: existinguser.email },
        { regOTPConfirmed: true },
      );

      console.log(existinguser.regOTPConfirmed);
      console.log(existinguser.email);
      console.log('Current:', existinguser);

      return existinguser;
    } catch (error) {
      console.error(error.message);
      throw new UnauthorizedException('Invalid Credentials');
    }
  }
}
