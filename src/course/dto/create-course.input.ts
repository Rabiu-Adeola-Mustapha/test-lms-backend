/* eslint-disable prettier/prettier */
import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import {Course_Category} from "../entities/enums" ;
import { IsNotEmpty, IsString } from 'class-validator';
//import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';



registerEnumType(Course_Category, { name: 'Course_Category' });


@InputType()
export class CreateCourseInput {
  
  
  @Field()
  @IsNotEmpty()
  @IsString()
  course_title: string;

  
  @Field()
  courseMaterial: string;


  @Field()
  description: string;

  
  @Field()
  price: number;

  @Field()
  author: string;

  
  @Field()
  courseImage: string;

  @Field({nullable :true})
  courseVideoUrl: string;


  // New ones 
  
  
  // @ield
  // category?: [Course_Category];

  
  // @Field(() => GraphQLUpload)
  // authorImageUrl?:  Promise<FileUpload>;

  

  
}
