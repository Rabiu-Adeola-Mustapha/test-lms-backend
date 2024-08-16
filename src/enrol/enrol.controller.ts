/* eslint-disable prettier/prettier */
import {  Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { EnrolService } from './enrol.service';
//import { CreateEnrolmentInput } from './dto/create-enrolment.inputs';
//import { EnrolmentOutput } from './dto/enrol.output';
//import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Response } from 'express';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('enrol')
export class EnrolController {
  constructor(private readonly enrolService : EnrolService) {}


  @UseGuards(JwtAuthGuard)
  @Post("/:course")   
    registerCourse(
        @Res() response: Response,
        @Param('courseId') courseId: string,
         @CurrentUser() users: User,
       // @Body('enrolInput') enrolInput : CreateEnrolmentInput,
        
    ): Promise<void> {

     //const  {  course_id } = enrolInput

     const course_Id = new Types.ObjectId(courseId);
    const userId = new Types.ObjectId(users._id);

    //  if (!users._id) {
    //    throw new UnauthorizedException("Invalid user")
    //   }
       //console.log("enrolInput:", enrolInput)
      const newEnrol = this.enrolService.registerCourse(courseId, userId);
       // Return a success response indicating successful course registration
       response.status(200).json({
        status: "success",
        data: newEnrol,
        //user: user, // Optionally include user data in the response
      });

     return;
  }


  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserEnrolments(@CurrentUser() user: User) {
    return this.enrolService.getUserEnrolments(user._id.toString()) || [];
  }

}
