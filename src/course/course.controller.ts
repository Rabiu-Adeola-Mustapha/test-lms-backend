/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Patch, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, Ip, Logger, InternalServerErrorException } from '@nestjs/common';
import { CourseService } from './course.service';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { MyLoggerService } from 'src/common/my-logger/my-logger.service';
import { Log } from 'src/common/decorators/log.decorator';
import { Types } from 'mongoose';




@Controller('course')
@Log()
export class CourseController {
    private readonly context = 'CourseController';
    constructor(
        private readonly courseService: CourseService,
        private readonly logger: MyLoggerService,  // Inject MyLoggerService
    ) {}

    private readonly loggery = new Logger(CourseController.name); //
        

      
    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @Log()
    @UseInterceptors(FilesInterceptor('files'))
    async uploadCourse(
      @UploadedFiles(
    //     new ParseFilePipe({
    //       validators: [
    //         new MaxFileSizeValidator({ maxSize: 1000000 }),
    //         new FileTypeValidator({ fileType: /jpeg|pdf|jpg|png/ }),
    //       ],
    //     }),
      )
        files:   Array<Express.Multer.File>,
       // @CurrentUser() user: TokenPayload,
        @Body() createCourseInput: CreateCourseInput
    ) {
          console.log("User mail")
          console.log("Got Here.....")

          console.log('Files:', files);
          console.log('CreateCourseInput:', createCourseInput);

        if (!files || files.length === 0) {
            throw new BadRequestException('Files is required');
        }

        try {
          let courseImageUrl = null;
          let courseMaterialUrl = null;
    
          for (const file of files) {
            if (file.mimetype.startsWith('image')) {
              courseImageUrl = await this.courseService.uploadImage(file.buffer);
            } else if (file.mimetype === 'application/pdf') {
              courseMaterialUrl = await this.courseService.uploadPDF(file.buffer);
            } else {
              throw new BadRequestException('Unsupported file type');
            }
          }
    
          if (!courseImageUrl || !courseMaterialUrl) {
            throw new BadRequestException('Course image, course material');
          }
    
          const newCourseInput = {
            ...createCourseInput,
            courseImage: courseImageUrl.secure_url,
            courseMaterial: courseMaterialUrl.secure_url,
          };
            
            const createdCourse = await this.courseService.create({ ...newCourseInput });

            console.log("Created Course : ",createdCourse);
            
            return {
                message: 'Course created successfully',
                course: createdCourse,
              };

            
        } catch (error) {
            throw new BadRequestException(`File upload failed: ${error.message}`);
        }

    
    }


    @UseGuards(JwtAuthGuard)
    @Get('/single/:id')
    @Log()
    async getCourse(@Param('id') id: string) {

      this.logger.log('Handling GET Single request', this.context);

      if (!Types.ObjectId.isValid(id)) {
        this.logger.error(`Invalid ObjectId: ${id}`, null, this.context);
        throw new NotFoundException('Invalid course id');
        
      }

      try {
        const course = await this.courseService.findOne(id);

        if (!course) {
  
          throw new NotFoundException('Course not found');
        }
        return course;

      } catch (error) {

        this.logger.error(`Error in GET /course: ${error.message}`, error.stack, this.context);

        throw new InternalServerErrorException(error.message);
      }
     
    }

    
    @Get()
    @Log()
    async getAll() {
      this.logger.log('Handling GET All request', this.context);
      try {
        
        return this.courseService.findAll();

      } catch (error) {

        this.logger.error(`Error in GET /course: ${error.message}`, error.stack, this.context);

        throw new InternalServerErrorException(error.message);
      }
     
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update/:id')
    async updateCourse(@Param('id') id: string, @Body()  updateCourseInput: UpdateCourseInput) {
        const updatedCourse = await this.courseService.update(id, updateCourseInput);
        if (!updatedCourse) {
          throw new NotFoundException('Course not found');
        }
        return updatedCourse;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async removeCourse(@Param('id') id: string) {

        const result = await this.courseService.remove(id);
        if (!result) {
          throw new NotFoundException('Course not found');
        }
        return { message: 'Course removed successfully' };
    }
}
