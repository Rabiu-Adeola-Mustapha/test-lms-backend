/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseController } from './course.controller';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { string } from 'joi';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { Stream } from 'stream'

@Resolver(() => Course)
export class CourseResolver {
  constructor(
    private readonly courseService: CourseService,
    //private readonly courseController: CourseController,
  ) {}

  // @Mutation(() => Course)
  // @UseGuards(GqlAuthGuard)
  // async createCourse(
  //   @Args('createCourseInput') createCourseInput: CreateCourseInput,
  //   @Args('courseImage', { type: () => GraphQLUpload }) courseImage: FileUpload,
  //   @Args('courseMaterial', { type: () => GraphQLUpload }) courseMaterial: FileUpload
  //   ) {

      //const { courseImage, courseMaterial } = createCourseInput;

      // Mock user token payload
      //const user = { email: 'mockuser@example.com' } as TokenPayload;


      // upload course image
      //const courseImageUpload = await courseImage;


      // Function to convert FileUpload to Express.Multer.File
    // const convertToMulterFile = async (upload: FileUpload): Promise<Express.Multer.File> => {
    //   const stream = upload.createReadStream();
    //   const chunks: Buffer[] = [];
    //   for await (const chunk of stream) {
    //     chunks.push(chunk);
    //   }

      //const buffer = Buffer.concat(chunks);


      // return {
      //   buffer,
      //   fieldname: '',
      //   originalname: upload.filename,
      //   encoding: upload.encoding,
      //   mimetype: upload.mimetype,
      //   size: buffer.length,
      //   stream: new Stream.PassThrough(), // stream is required but not used
      //   destination: '',
      //   filename: upload.filename,
      //   path: '',
      // } as Express.Multer.File;
    //};



    // Convert the FileUpload objects
    // const courseImageUpload = await courseImage;
    // const courseMaterialUpload = await courseMaterial;
    // const multerCourseImage = await convertToMulterFile(courseImage );
    // const multerCourseMaterial = await convertToMulterFile(courseMaterial);

    // Upload course image
   // const courseImageUrl = await this.courseController.uploadProfilePicture(multerCourseImage, user);

    // Upload course material
  //  const courseMaterialUrl = await this.courseController.uploadProfilePicture(multerCourseMaterial, user);



      // const courseImageUrl = await this.courseController.uploadProfilePicture(
      //   { ...courseImageUpload, buffer: await courseImageUpload.createReadStream().read() } as Express.Multer.File,
      //   user,
      // );

      //     // Upload course material
      // const courseMaterialUpload = await courseMaterial;
      //   const courseMaterialUrl = await this.courseController.uploadProfilePicture(
      //     { ...courseMaterialUpload, buffer: await courseMaterialUpload.createReadStream().read() } as Express.Multer.File,
      //     user,
      // );


    // const newCourseInput = {
    //   ...createCourseInput,
    //   course_image_url: courseImageUrl.url,
    //   course_material_url: courseMaterialUrl.url,
    // };

      //const courseMaterialUrl = await this.Course.uploadPDF(courseMaterial);
    //return this.courseService.create(newCourseInput);


  //}

  @Query(() => [Course], )
  findAllCourses() {
    return this.courseService.findAll();
  }

  @Query(() => Course, )
  findOneCourse(@Args('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Mutation(() => Course)
  updateCourse(@Args('updateCourseInput') updateCourseInput: UpdateCourseInput) {
    return this.courseService.update(updateCourseInput.id, updateCourseInput);
  }

  @Mutation(() => Course)
  removeCourse(@Args('enrolment') id: string) {
    return this.courseService.remove(id);
  }
}
