/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from '../../database/abstract.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
@ObjectType()
export class Transaction extends AbstractEntity {
  [x: string]: any;
  @Prop()
  @Field()
  email: string;

  @Prop()
  @Field()
  userName: string;

  @Prop()
  @Field()
  cartId: string;
  
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


  
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);