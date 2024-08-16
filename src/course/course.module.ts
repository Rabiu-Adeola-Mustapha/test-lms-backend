/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseResolver } from './course.resolver';
import { CourseRepository } from './course.repository';
import { Course, CourseSchema } from './entities/course.entity';
import { DatabaseModule } from 'src/common/database/database.module';
import { FileUploadModule } from 'src/common/file-upload/file-upload.module';
import { CourseController } from './course.controller';
import { MyLoggerModule } from 'src/common/my-logger/my-logger.module';
import { MyLoggerService } from 'src/common/my-logger/my-logger.service';

@Module({
  imports: [ 
      DatabaseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
      FileUploadModule,
      MyLoggerModule
    ],
  providers: [CourseResolver, CourseService, CourseRepository, MyLoggerService],
  exports: [CourseService, CourseRepository],
  controllers: [CourseController],
})
export class CourseModule {}
