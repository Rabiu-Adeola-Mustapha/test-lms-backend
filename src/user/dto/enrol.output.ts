/* eslint-disable prettier/prettier */
import {  Field, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class EnrolmentOutput {
  
  @Field()
  userId: string;
  
  @Field()
  courseId: string;

  
  @Field()
  courseImage: string;

  
  @Field()
  courseTitle: string;
  
  @Field()
  course_url: string;


  // Resume or Start
  // Percentage Watched
  
}
