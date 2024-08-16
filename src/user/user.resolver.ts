/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenPayload } from '../auth/token-payload.interface';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateEnrolmentInput } from '../enrol/dto/create-enrolment.inputs';
import { CourseService } from '../course/course.service';
import { Course } from 'src/course/entities/course.entity';
import { EnrolmentOutput } from '../enrol/dto/enrol.output';
import { Enrol } from 'src/enrol/entities/enrol.entity';
import { Types } from 'mongoose';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
//import { EnrolmentService } from './enrolmet.service';
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly usersService: UserService,
    private readonly courseService: CourseService,
    //private readonly enrolmentService: EnrolmentService
    ) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    
      
     return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  //@UseGuards(GqlAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('_id') _id: string) {
    return this.usersService.findOne(_id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
     @CurrentUser() user: TokenPayload
  ) {
    return this.usersService.update(user._id, updateUserInput);
  }

  // Updating user Avatar
  // @Mutation(() => User)
  // @UseGuards(GqlAuthGuard)
  // updateUserAvatar(
  //   @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  //    @CurrentUser() user: TokenPayload
  // ) : Promise<string>{
  //   const avatarUrl =  this.usersService.updateAvatarGQL( user._id, file);
  //   return avatarUrl ;
  // }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  removeUser(@CurrentUser() user: TokenPayload) {
    return this.usersService.remove(user._id);
  }

  @Mutation(()=> Enrol)
  @UseGuards(GqlAuthGuard)
  async registerCourse(@Args('createEnrolmentInput') createEnrolmentInput : CreateEnrolmentInput,
  @CurrentUser() user: TokenPayload
   ){
    // try return a Promise here
    const { course_id } = createEnrolmentInput ;
    //  if (user._id !== user_id) {
    //   throw new UnauthorizedException("Invalid user")
    //  }

     const courseId = new Types.ObjectId(course_id);
    const userId = new Types.ObjectId(user._id);

    const newEnrol =  await this.usersService.registerACourse(courseId,userId);


    return newEnrol;
    //return this.enrolmentService.create(createEnrolmentInput);

  }


  @ResolveField()
  @UseGuards(GqlAuthGuard)
  async courses(@Parent() user : User) {
    
    console.log(user);
    return this.courseService.getManyCourses(user.courses);
    
  }
 

}
 