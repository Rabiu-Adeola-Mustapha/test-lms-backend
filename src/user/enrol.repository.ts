// /* eslint-disable prettier/prettier */
// import { Injectable, Logger } from '@nestjs/common';
// import { AbstractRepository } from '../common/database/abstract.repository';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Enrolment } from './entities/enrol.entity'; 



// @Injectable()
// export class EnrolmentRepository extends AbstractRepository<Enrolment> {
//   protected readonly logger = new Logger(EnrolmentRepository.name);

//   constructor(@InjectModel(Enrolment.name) enrolmentModel: Model<Enrolment>) {
//     super(enrolmentModel);
//   }
// }