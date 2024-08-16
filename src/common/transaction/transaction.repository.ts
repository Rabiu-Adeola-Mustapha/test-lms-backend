/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../database/abstract.repository';
import { Transaction, TransactionDocument } from './entities/transaction.entity'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransactionRepository extends AbstractRepository<TransactionDocument> {
  protected readonly logger = new Logger(TransactionRepository.name);

  constructor(@InjectModel(Transaction.name) TransactionModel: Model<TransactionDocument>) {
    super(TransactionModel);
  }
}