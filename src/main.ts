/* eslint-disable prettier/prettier */
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { AllExceptionsFilter } from './all-exceptions.filter';
// import { CsrfInterceptor } from './csrf.interceptor';
import helmet from 'helmet';
// const csurf = require('csurf');
import { MyLoggerService } from './common/my-logger/my-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // bufferLogs: true, ## To use Logger Globally
  });

  const logger = app.get(MyLoggerService);
  // const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // Using Logger Globally
  // app.useLogger(app.get(MyLoggerService));

  // Set up CORS using NestJS built-in method
  app.enableCors({
    origin: [
      'https://lms-application-six.vercel.app/',
      'https://d13915glct9pkw.cloudfront.net',
      'http://localhost:3000',
      'https://mivant-green.vercel.app',
      'https://mivant.vercel.app',
    ],
    methods: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'x-apollo-operation-name',
      'apollo-require-preflight',
    ],
    credentials: true,
  });

  // Cookie parser
  app.use(cookieParser());

  // Apply security-related HTTP headers using Helmet
  app.use(helmet());

  // Enable CSRF protection
  // app.use(csurf({ cookie: true }));

  // Global pipes and interceptors
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new CsrfInterceptor());

  // Body parsers
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Set Global prefix
  app.setGlobalPrefix('api/v1');

  // Start NestJS application
  await app.listen(5001, () => {
    console.log('Application is running on: http://localhost:5001');
  });
}

bootstrap();
