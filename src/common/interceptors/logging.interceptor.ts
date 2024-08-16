/* eslint-disable prettier/prettier */
// src/common/interceptors/logging.interceptor.ts
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { tap, catchError } from 'rxjs/operators';
  import { MyLoggerService } from '../my-logger/my-logger.service'; 
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {

    constructor(private readonly logger: MyLoggerService) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      const method = request.method;
      const url = request.url;
      const className = context.getClass().name;
      const handlerName = context.getHandler().name;

      const now = Date.now();
        
      // Log at the start of the request
      this.logger.log(`${method} ${url} - ${Date.now() - now}ms ${className}#${handlerName} handling request`, className);
  
      return next.handle().pipe(
        tap(() => {
            // Log on successful handling
          this.logger.log(
            `${method} ${url} - ${Date.now() - now}ms ${className}#${handlerName} handled`,
            className
          );
        }),
        catchError((error) => {
            //log on error
          this.logger.error(
            `${method} ${url} - ${Date.now() - now}ms ${className}#${handlerName} error: ${error.message}`,
            error.stack,
            className
          );
          return throwError(() => error);
        })
      );
    }
  }
  