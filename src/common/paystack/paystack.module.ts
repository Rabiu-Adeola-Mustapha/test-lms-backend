/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { PaymentController } from './paystack.controller';
import { EnrolService } from 'src/enrol/enrol.service'; // Update the path as necessary
import { CourseModule } from 'src/course/course.module';
import { EnrolModule } from 'src/enrol/enrol.module';
import { Enrol, EnrolSchema } from 'src/enrol/entities/enrol.entity';
import { DatabaseModule } from '../database/database.module';
import { EnrolRepository } from 'src/enrol/enrol.repository';
import { MyLoggerModule } from '../my-logger/my-logger.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Enrol.name, schema:EnrolSchema  },
        //{ name: Enrol.name, schema: EnrolSchema },
     ]),
      EnrolModule, 
      CourseModule,
      MyLoggerModule
  ],
  controllers: [PaymentController],
  providers: [PaystackService, EnrolService, EnrolRepository],
})
export class PaystackModule {}
