/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
//import { TransactionService } from './transaction.service';
import { EnrolModule } from 'src/enrol/enrol.module';
import { StripeService } from '../stripe/stripe.service';
import { EnrolService } from 'src/enrol/enrol.service';
import { EnrolRepository } from 'src/enrol/enrol.repository';
import { WebhooksController } from './transaction.controller';
import { CourseModule } from 'src/course/course.module';
import { Enrol, EnrolSchema } from 'src/enrol/entities/enrol.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Enrol.name, schema:EnrolSchema  },
      //{ name: Enrol.name, schema: EnrolSchema },
   ]),
    EnrolModule, CourseModule],
  providers: [StripeService, EnrolService, EnrolRepository],
  controllers: [WebhooksController],
  exports: [StripeService]
})
export class TransactionModule {}
