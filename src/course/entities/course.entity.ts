/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from '../../common/database/abstract.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Course_Category } from "./enums";
import { User } from 'src/user/entities/user.entity';



registerEnumType(Course_Category, { name: 'Course_Category' });

@Schema({ versionKey: false })
@ObjectType()
export class Course extends AbstractEntity {
  [x: string]: any;

//   Data for uploading :
// Course url,
// Price,
// Course title,
// Author, 
// Category,
// Course overview,
// Key outcomes ,
// Course syllabus, 
// Ratings,
// Duration,
// Course_image,

  @Prop()
  @Field()
  course_title: string;

  @Prop()
  @Field()
  description: string;

  @Prop()
  @Field()
  price: number;

  @Prop()
  @Field()
  courseImage?: string;

  @Prop()
  @Field()
  courseMaterial?: string;

  @Prop()
  @Field(() => Course_Category)
  category?: [Course_Category];
 
  @Prop()
  @Field()
  author?: string;

  @Prop()
  @Field()
  authorImageUrl?: string;

  @Prop()
  @Field()
  ratings?: string;

  @Prop()
  @Field()
  ratingCount: number;

  @Prop()
  @Field()
  courseVideoUrl: string;

  @Prop()
  @Field()
  number_of_students: number;

  @Prop()
  @Field()
  number_of_students_completed: number;

  @Prop()
  @Field(type => [User])
  users : string[];

  @Prop()
  @Field()
  duration: string;

  @Prop()
  @Field()
  language: string;

  @Prop()
  @Field()
  subtitle: string;

  @Prop()
  @Field()
  author_profession: string;

  

}


export const CourseSchema = SchemaFactory.createForClass(Course);
