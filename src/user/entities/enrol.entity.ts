// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { AbstractEntity } from '../../common/database/abstract.entity';
// import { Field, ObjectType } from '@nestjs/graphql';

// @Schema({ versionKey: false })
// @ObjectType()
// export class Enrolment extends AbstractEntity {
//   [x: string]: any;

//   @Prop()
//   @Field()
//   email?: string;

//   @Prop()
//   @Field()
//   userId: string;
  
//   // @Prop()
//   // @Field()
//   // firstNname?: string;
 
//   // @Prop()
//   // @Field()
//   // lastNname?: string;
  
//   // @Prop()
//   // @Field()
//   // gender?: string;
  
//   // @Prop()
//   // @Field()
//   // phone?: string;

//   @Prop()
//   @Field()
//   courseId: string;

//   @Prop()
//   @Field()
//   courseImage: string;

//   @Prop()
//   @Field()
//   courseTitle: string;

//   @Prop()
//   @Field()
//   course_url: string;
  

//   // @Prop()
//   // @Field()
//   // transact_id?: string;

//   // Resume or Start
//   // Percentage Watched



// }

// export const EnrolmentSchema = SchemaFactory.createForClass(Enrolment);