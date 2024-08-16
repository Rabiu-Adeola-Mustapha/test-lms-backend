/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { MailModule } from 'src/common/mail/mail.module';
import { CourseModule } from 'src/course/course.module';
import { Enrol, EnrolSchema } from './entities/enrol.entity';
import { UserModule } from 'src/user/user.module';
import { EnrolService } from './enrol.service';
import { EnrolRepository } from './enrol.repository';
import { CourseService } from 'src/course/course.service';
import { EnrolController } from './enrol.controller';
//import { EnrolController } from './enrol.controller';

@Module({
    imports: [
        DatabaseModule.forFeature([{ name: Enrol.name, schema: EnrolSchema }]),
        MailModule,
         CourseModule,
         //UserModule
    ],
    providers: [EnrolService, EnrolRepository],
    exports: [ EnrolService],
   controllers: [EnrolController],
})
export class EnrolModule {}
