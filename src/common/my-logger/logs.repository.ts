/* eslint-disable prettier/prettier */
// 


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './entities/log.entity'; 

@Injectable()
export class LogsRepository {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {}

  async create(log: Partial<Log>) {
    const newLog = new this.logModel(log);
    return newLog.save();
  }
}
