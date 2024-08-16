/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from '../../common/database/abstract.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import {Document } from 'mongoose';
//import { Course } from 'src/course/entities/course.entity';





@ObjectType()
export class CourseEnrolled {
  
  @Field()
  courseId: string;

  @Field()
  courseImage: string;

  @Field()
  courseTitle: string;

  @Field()
  courseVideoUrl: string;

  @Field()
  author: string;
}



@Schema({ versionKey: false })
@ObjectType()
export class Enrol extends AbstractEntity {
  [x: string]: any;

  @Prop()
  @Field()
  email?: string;

  @Prop()
  @Field()
  userId: string;

  @Prop([{ type: CourseEnrolled }])
  @Field(() => [CourseEnrolled])
  courses: CourseEnrolled[];
  
 

  // @Prop()
  // @Field()
  // courseImage?: string;

  // @Prop()
  // @Field()
  // courseTitle: string;

  // @Prop()
  // @Field()
  // course_url?: string;
  
  
   // @Prop()
  // @Field()
  // firstNname?: string;
 
  // @Prop()
  // @Field()
  // lastNname?: string;
  
  // @Prop()
  // @Field()
  // gender?: string;
  
  // @Prop()
  // @Field()
  // phone?: string;
  
  // @Prop()
  // @Field()
  // transact_id?: string;

  // Resume or Start
  // Percentage Watched



}




export const EnrolSchema = SchemaFactory.createForClass(Enrol);
export type EnrolDocument = Enrol & Document;