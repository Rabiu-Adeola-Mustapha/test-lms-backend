/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { User, UserSchema } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { MailModule } from 'src/common/mail/mail.module';
import { CourseModule } from 'src/course/course.module';
//import { EnrolmentService } from './enrolmet.service';
// import { Enrolment, EnrolmentSchema } from
import { EnrolService } from 'src/enrol/enrol.service';
//import { EnrolmentRepository } from './enrol.repository';
import { EnrolModule } from 'src/enrol/enrol.module';
//import { EnrolModule } from 'src/enrol/enrol.module';
import { UserController } from './user.controller';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { MailService } from 'src/common/mail/mail.service';
import { CourseService } from 'src/course/course.service';
import { Enrol, EnrolSchema } from 'src/enrol/entities/enrol.entity';
import { EnrolmentOutput } from 'src/enrol/dto/enrol.output';
import { EnrolRepository } from 'src/enrol/enrol.repository';
import { MyLoggerModule } from 'src/common/my-logger/my-logger.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: User.name, schema: UserSchema },
       { name: Enrol.name, schema: EnrolSchema },
    ]),
    MailModule,
     CourseModule,
     EnrolModule,
     MyLoggerModule,
     
     
    
  ],
  providers: [UserResolver, UserService, UserRepository,MailService,EnrolRepository,
    CourseService,
    EnrolService,
    FileUploadService],
    // EnrolmentService, EnrolService, EnrolmentRepository],
               
  exports: [UserService, UserRepository],
    controllers: [UserController],
})
export class UserModule {}
