/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CourseRepository } from './course.repository';
import { Course } from './entities/course.entity';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createCourseInput: CreateCourseInput): Promise<Course> {

    const newCourse = this.courseRepository.create({
      ...createCourseInput,
    });
    return newCourse;
  }

  async findAll() {
    return this.courseRepository.find({});
  }

  async findOne(_id: string) {
    return this.courseRepository.findOne({_id});
  }

  async update(_id: string, updateCourseInput: UpdateCourseInput) {
    return this.courseRepository.findOneAndUpdate(
      {_id: _id },
      {
        $set : {
          ...updateCourseInput,
        }
      },
      //{new: true}
    )
  }

  async remove(_id: string) {
    return this.courseRepository.findOneAndDelete({_id});
  }

  async getManyCourses(courseIds : string[]): Promise<Course[]>{

    return this.courseRepository.find({
      where : {
        id : {
          $in : courseIds,
        }
      }
    })

  }


  async uploadPDF(file: Buffer)  : Promise<UploadApiResponse>{

    return  this.fileUploadService.uploadFile(file);
    
  }

  async uploadImage(file: Buffer) : Promise<UploadApiResponse> {
    return  this.fileUploadService.uploadFile(file);
  }

  async uploadVideo(file: Buffer): Promise<any> {
    return this.fileUploadService.uploadFile(file);
  }

  
}
