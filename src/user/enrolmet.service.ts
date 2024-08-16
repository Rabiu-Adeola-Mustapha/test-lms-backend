// /* eslint-disable prettier/prettier */
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { EnrolmentRepository } from './enrol.repository'; 
// import { EnrolmentOutput } from './dto/enrol.output';
// import { CreateEnrolmentInput } from './dto/create-enrolment.inputs'; 
// import { CourseService } from 'src/course/course.service';

// @Injectable()
// export class EnrolmentService {
//   constructor(
//     private readonly enrolmentRepository: EnrolmentRepository,
//     private readonly courseService : CourseService) {}
 
//     // Better inputy type should reflect enrol entity
//   async registerCourse(enrolInput : CreateEnrolmentInput): Promise<EnrolmentOutput> {

//     const { course_id, user_id } = enrolInput ;

//     // Confirm payment before adding course to User_Courses Array.
//     // Check transaction table/doc where Couse_Id and User_Id matches

//     try {
      
//       const { 
//         //Course_url,
//         course_title,
//         //description,
//         //price,
//         //ratingCount,
//         //author,
//         course_image_url,
//          } = await this.courseService.findOne(course_id);

//         const newEnrol =  await this.enrolmentRepository.create ({
          
//          userId : user_id,
//           courseId: course_id,
//           courseImage: course_image_url,
//           courseTitle: course_title,
//           //course_url: Course_url,
//           // Better inputy type should reflect enrol entity
          
//         });

//         // send mail of successful course registration
      
  
//        return newEnrol;
      
//     } catch (error) {
//         console.log(error);
//         throw new UnauthorizedException(error.message);
//         // Logger 
//     }
       
       
//   }
  
//   // async create(createEnrolment: EnrolmentOutput): Promise<EnrolmentOutput> {
//   //   const newEnrolment = this.enrolRepository.create({
      
//   //     courseId: createEnrolment.courseId,
//   //     courseImage: createEnrolment.courseImage,
//   //     courseTitle: createEnrolment.courseTitle,
//   //     Course_url  : createEnrolment.course_url
//   //     // Transact_Id
//   //     // User_Id
//   //     //User Gender
//   //     //User Mail
//   //     // User Phone.

//   //   });

//   //   return newEnrolment;
//   // }
// }
