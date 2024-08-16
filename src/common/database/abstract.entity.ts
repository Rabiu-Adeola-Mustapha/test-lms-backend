/* eslint-disable prettier/prettier */
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

@Schema()
@ObjectType({ isAbstract: true })
export class AbstractEntity extends Document{
    
    @Prop({ type: SchemaTypes.ObjectId })
    @Field(() => ID)
    _id: Types.ObjectId;

}