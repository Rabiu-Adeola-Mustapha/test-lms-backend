/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MyLoggerService } from './my-logger.service';
import { DatabaseModule } from '../database/database.module';
import { LogsRepository } from './logs.repository';
import { Log, LogSchema } from './entities/log.entity'

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  providers: [MyLoggerService, LogsRepository],
  exports: [MyLoggerService, LogsRepository],
 
})  
export class MyLoggerModule {}
