/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DatabaseModule } from './common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MailModule } from './common/mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { TransactionModule } from './common/transaction/transaction.module';
import { FileUploadModule } from './common/file-upload/file-upload.module';
import { EnrolModule } from './enrol/enrol.module';
import { join } from 'path';
import { ApolloServer } from 'apollo-server-express';
import { PaystackModule } from './common/paystack/paystack.module';
//import { PaystackService } from './paystack/paystack.service';
import { StripeModule } from './common/stripe/stripe.module';
import { MyLoggerModule } from './common/my-logger/my-logger.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerMiddleware } from './common/my-logger/logger.middleware';
import { CourseController } from './course/course.controller';
import { UserController } from './user/user.controller';
import { PaymentController } from './common/paystack/paystack.controller';
import { EnrolController } from './enrol/enrol.controller';
import { WebhooksController } from './common/transaction/transaction.controller';
import { StripeController } from './common/stripe/stripe.controller';
import { MyLoggerService } from './common/my-logger/my-logger.service';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema: Joi.object({
      //   MONGODB_URI: Joi.string().required(),
      // }),
    }),

    // To overide throtller use @SkipThrottle() or @Throttle()
    ThrottlerModule.forRoot([{
      name : 'Average', // On an average request rate
      ttl: 60000, // Time to live in milliseconds (1 minute) 1k msecs = 1secs
      limit: 10, // Maximum number of requests within the TTL
    }, {
      name : 'Burst', // On a burst request rate
      ttl: 10000, // Time to live in milliseconds (10 seconds)
      limit: 5, // Maximum number of requests within the TTL
    }]),
    
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      //join(process.cwd(), 'src/schema.gql'),
    
    }),

    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 25,
     },{
      name: 'long',
      ttl: 60000,
      limit: 100,
    }]),

    UserModule,
    DatabaseModule,
    MailModule,
    AuthModule,
    CourseModule,
    TransactionModule,
    FileUploadModule,
    EnrolModule,
    PaystackModule,
    StripeModule,
    MyLoggerModule,
  ],
  controllers: [AppController],
  providers: [MyLoggerService, AppService, GoogleStrategy, AuthService, JwtService, {
    provide: APP_GUARD,
    useClass : ThrottlerGuard,
  }],// PaystackService
})

export class AppModule {}


// export class AppModule  implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//         .apply(LoggerMiddleware)
//         // Apply LoggerMiddleware to Controllers
//         .forRoutes(
//            CourseController,
//            UserController, 
//            PaymentController, 
//            EnrolController,
//            WebhooksController,
//            StripeController            
//           ); 

//         // Apply globally to all routes
//         // .forRoutes({ path: '*', method: RequestMethod.ALL }); 


//          // Apply to specific routes
//           //   .forRoutes(
//           //     { path: 'courses', method: RequestMethod.GET },
//           //     { path: 'users', method: RequestMethod.POST },
//           //     { path: 'products', method: RequestMethod.PUT },
//           // );
            


//   }
// }
