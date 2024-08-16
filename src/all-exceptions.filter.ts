/* eslint-disable prettier/prettier */
import { Catch, ArgumentsHost, HttpStatus, HttpException, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from 'express';
import { MyLoggerService } from "./common/my-logger/my-logger.service";
import { MongoError} from 'mongodb'; // Import MongoError from mongodb
import * as mongoose from 'mongoose'; // Import mongoose if you use mongoose



type MyResponseObj = {
    statusCode: number,
    timestamp: string,
    path: string,
    response: string | object,
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {


    constructor(
        private readonly myLoggerService: MyLoggerService,
    ) {
        super();
    }

    async catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const myResponseObj: MyResponseObj = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: '',
        };

        // Add more MongoDB Error Types if you want
        if (exception instanceof HttpException) {
            myResponseObj.statusCode = exception.getStatus();
            myResponseObj.response = exception.getResponse();

            if (exception instanceof UnauthorizedException || exception instanceof ForbiddenException) {
                this.myLoggerService.error(`Unauthorized access attempt`, JSON.stringify(myResponseObj), AllExceptionsFilter.name);
              }
              
        } else if (exception instanceof MongoError) { 
            // Handle MongoDB errors
            myResponseObj.statusCode = this.getMongoErrorStatusCode(exception);; // Unprocessable Entity or another appropriate status code
            myResponseObj.response = exception.message;
        } else if (exception instanceof mongoose.Error) {
            // Handle mongoose specific errors
            myResponseObj.statusCode = this.getMongooseErrorStatusCode(exception);
            myResponseObj.response = exception.message;
        }
         else {
           // myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            myResponseObj.response = 'Internal Server Error';
        }

       // Log the error
      this.myLoggerService.error(
        typeof myResponseObj.response === 'string' 
          ? myResponseObj.response 
          : JSON.stringify(myResponseObj.response), 
        exception instanceof Error ? exception.stack : ''
      );
        // send response
        response
            .status(myResponseObj.statusCode)
            .json(myResponseObj);


        //super.catch(exception, host);
    }


    private getMongoErrorStatusCode(error: MongoError): number {
        // Map MongoDB errors to HTTP status codes
        switch (error.code) {
            case 11000: // Duplicate key error
                return HttpStatus.CONFLICT;
            // Add more MongoDB error cases as needed
            default:
                return HttpStatus.UNPROCESSABLE_ENTITY;
        }
    }


    private getMongooseErrorStatusCode(error: mongoose.Error): number {
        // Map mongoose errors to HTTP status codes
        if (error instanceof mongoose.Error.ValidationError) {
            return HttpStatus.BAD_REQUEST;
        }
        // Add more mongoose error cases as needed
        return HttpStatus.UNPROCESSABLE_ENTITY;
    }
}
