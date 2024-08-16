/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { IsObjectId } from 'src/common/error-Handler/objectId';

@InputType()
export class CreateEnrolmentInput {
  
  @Field()
  @IsObjectId({ message: 'Invalid ObjectId format' }) 
  course_id: string;
  
 // @Field()
  //@IsObjectId({ message: 'Invalid ObjectId format' }) 
  //user_id: string;
  
  // @Field()
  // transact_id?: string;

}
