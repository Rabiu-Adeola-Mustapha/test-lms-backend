/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { response, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { Log } from 'src/common/decorators/log.decorator';
import { MyLoggerService } from 'src/common/my-logger/my-logger.service';
import { string } from 'joi';
import { GoogleAuthGuard } from './guards/google-auth.guard';

import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {

  private readonly context = 'AuthController';

  constructor(private readonly authService: AuthService,
    private readonly logger: MyLoggerService,
  ) {}


  // Login route
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Log()
  async login(
    @CurrentUser() users: User,
    @Res({ passthrough: true }) response: Response,
  ) {

    this.logger.log('Handling User LOgin ', this.context);

    try {

     await this.authService.login(users, response);

        

    } catch (error) {

      this.logger.error(`Error in POST /auth: ${error.message}`, error.stack, this.context);

      throw new InternalServerErrorException(error.message);
    }
  }


  // Logout route
  @Post('logout')
  @Log()
  async logout(@Res({ passthrough: true }) response: Response) {
    this.logger.log('Handling User Logout', this.context);

    try {
      await this.authService.logout(response);
    } catch (error) {
      this.logger.error(`Error in POST /auth/logout: ${error.message}`, error.stack, this.context);
      throw new InternalServerErrorException(error.message);
    }
  }



  // Google Login route
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() _req) {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { user } = req;

    const token : String = await this.authService.login(user, res);

    if (token) {
       res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
       } else {
       res.redirect(`${process.env.FRONTEND_URL}/auth/failure`);
     }
  }


  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // googleLogin() {
  //   // Initiates the Google OAuth2 login flow
  // }

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleLoginCallback(@Req() req: Request, @Res() res: Response) {
  //   const jwt: string = req.user['accessToken'];
  //   if (jwt) {
  //     res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${jwt}`);
  //   } else {
  //     res.redirect(`${process.env.FRONTEND_URL}/auth/failure`);
  //   }
  // }



  // Confirmation route for registering a user with OTP
  @Patch('otp/:email')
  async confirmRegOTP(
    @Res() response: Response,
    @Param('email') email: string,
    @Body('regOTP') otp: string,
  ) {

    this.logger.log('Handling OTP confirmation ', this.context);

    try {
      // Confirm OTP and log in the user
      console.log(email, otp);
      const user = await this.authService.confirmRegOTP(email, otp);
      await this.authService.login(user, response)

      return;

    } catch (error) {
      // Handle errors and return an appropriate response
      this.logger.error(`Error in POST /auth: ${error.message}`, error.stack, this.context);

      console.error(error.message);
        response.status(400).json({
        status: false,
        msg: 'Invalid credentials',
      });
    }
  }



}