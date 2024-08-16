/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ timestamps: true })
@ObjectType()
export class Log extends Document {
  @Prop()
  @Field()
  level: string;

  @Prop()
  @Field()
  message: string;

  @Prop()
  @Field({ nullable: true })
  context?: string;

  @Prop()
  @Field({ nullable: true })
  stack?: string;

  @Prop()
  @Field()
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
export type LogDocument = Log & Document;
