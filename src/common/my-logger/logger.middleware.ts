/* eslint-disable prettier/prettier */
// my-logger/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLoggerService } from './my-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly logger: MyLoggerService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        this.logger.log(`Request from IP: ${ip}`);
        next();
    }
}
