/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CourseEnrolled, Enrol, EnrolDocument } from '../enrol/entities/enrol.entity';
import { Course } from 'src/course/entities/course.entity'; 



@Injectable()
export class EnrolRepository extends AbstractRepository<Enrol> {
  protected readonly logger = new Logger(EnrolRepository.name);

  constructor(@InjectModel(Enrol.name) private readonly enrolModel: Model<EnrolDocument>) {
    super(enrolModel);
  }


  async createEnrolment(userId: string, course: CourseEnrolled): Promise<Enrol> {
    let enrol = await this.enrolModel.findOne({ userId });
    if (!enrol) {
      enrol = new this.enrolModel({ 
        _id: new mongoose.Types.ObjectId(),
        userId,
         courses: [course] });
    }
    enrol.courses.push(course);

    return enrol.save();
  }

  async findEnrolmentsByUserId(userId: string): Promise<Enrol> {
    return this.enrolModel.findOne({ userId }).exec();
  }
}