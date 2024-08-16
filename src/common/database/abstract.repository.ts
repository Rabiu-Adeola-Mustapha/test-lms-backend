/* eslint-disable prettier/prettier */
import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { FilterQuery, Model, Types, UpdateQuery, Document } from 'mongoose';

export abstract class AbstractRepository<T extends Document & AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<T>) {}

  async create(document: Omit<T, '_id'>): Promise<T> {

    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createdDocument.save()).toJSON() as unknown as T;

  }

 async save(document: T): Promise<T> {
    return (await document.save()).toJSON() as unknown as T;
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T & Document> {
    const document = await this.model.findOne(filterQuery); // , {}, { lean: true }

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      return null;
    }

    return document as unknown as T;
  }

  async findOneAndUpdate(
      filterQuery: FilterQuery<T>, update: UpdateQuery<T>,
  ): Promise<T> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as unknown as T;
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filterQuery, {}, { lean: true }) as unknown as T[];
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    return this.model.findOneAndDelete(filterQuery, { lean: true }) as unknown as T;
  }

  // async addItemToArray(userId: string, arrayField: keyof T, item: any): Promise<T> {
  //   let document = await this.findOne({ userId });
  //   if (!document) {
  //     document = await this.create({ userId, [arrayField]: [] } as unknown as T);
  //   }
  //   document[arrayField].push(item);

  //   // Log the document before saving
  //   this.logger.log('Document before saving:', document);
  //   return this.save(document);
  // }

  // async findByUserId(userId: string): Promise<T> {
  //   return this.findOne({ userId });
  // }
}