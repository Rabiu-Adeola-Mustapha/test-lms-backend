/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {

  @Field()
  userName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  regOTP?: string; // make this nullable true

  
  @Field({nullable: true})
  firstNname?: string;

  
  @Field({nullable: true})
  lastNname?: string;
  
  
  @Field({nullable: true})
  gender?: string;
  

  @Field({nullable: true})
  phone?: string;

  @Field({nullable: true})
  role: string; // make this nullable true

  @Field({nullable: true})
  dateOfBirth?: string;
  
  
  @Field({nullable: true})
  address?: string;
  
  
  @Field({nullable: true})
  city?: string;
  
  @Field({nullable: true})
  state?: string;

  
  @Field({nullable: true})
  avatarUrl: string;

}