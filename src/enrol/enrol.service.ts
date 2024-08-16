/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EnrolRepository } from './enrol.repository';
import { EnrolmentOutput } from './dto/enrol.output';
import { CreateEnrolmentInput } from './dto/create-enrolment.inputs';
import { CourseService } from 'src/course/course.service';
import { Types } from 'mongoose';

@Injectable()
export class EnrolService {
  constructor(
    private readonly enrolRepository: EnrolRepository,
    private readonly courseService : CourseService) {}
 
    // Better inputy type should reflect enrol entity
  async registerCourse(courseId, userId) {

    //const { course_id, user_id } = enrolInput ;

    // Confirm payment before adding course to User_Courses Array.
    // Check transaction table/doc where Couse_Id and User_Id matches

    try {
      
      const { 
          courseVideoUrl,
          course_title,
          courseImage,
           author,
           //description,
          //price,
          //ratingCount,
         } = await this.courseService.findOne(courseId);

         const newCourse = {
          courseId: courseId.toString(),
          courseTitle: course_title,
          courseImage,
          courseVideoUrl,
          author,
         
        };


        const enrolment =  await this.enrolRepository.createEnrolment (
          
          userId,
          newCourse
          
        );

        // send mail of successful course registration
      
  
       return enrolment;
      
    } catch (error) {
        console.log(error);
        throw new UnauthorizedException(error.message);
        // Logger 
    }

   
       
       
  }
  

  async getUserEnrolments(userId: string) {
    return this.enrolRepository.findEnrolmentsByUserId(userId) || [];
  }
  
}
