/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from '../../common/database/abstract.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Course } from 'src/course/entities/course.entity';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
@ObjectType()
export class User extends AbstractEntity {
  [x: string]: any;
  @Prop()
  @Field()
  email: string;

  @Prop()
  @Field()
  userName: string;

  @Prop()
  password: string;
  
  @Prop()
  @Field()
  firstNname?: string;

  @Prop()
  @Field()
  lastNname?: string;
  
  @Prop()
  @Field()
  gender?: string;
  
  @Prop()
  @Field()
  phone?: string;

  @Prop()
  @Field(type => [Course], {defaultValue: []})
  courses?: string[];

  @Prop()
  @Field()
  dateOfBirth?: string;
  
  @Prop()
  @Field()
  address?: string;
  
  @Prop()
  @Field()
  city?: string;
  
  @Prop()
  @Field()
  state?: string;

  @Prop()
  @Field()
  avatarUrl?: string;

  @Prop()
  @Field()
  regOTP?: string;

  @Prop({ default: false })
  @Field()
  regOTPConfirmed?: boolean;

  @Prop({ default: false })
  @Field()
  updatedProfile?: boolean;

  @Prop()
  @Field({nullable: true}) // Make this an enum
  role?: string;

  @Prop({ type: String})
  @Field({nullable: true}) // Make this an enum
  resetToken: string;

  @Prop()
  @Field({nullable: true}) // Make this an enum
  resetTokenExpires: Date;

  
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);