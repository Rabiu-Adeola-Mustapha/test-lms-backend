/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { MyLoggerModule } from 'src/common/my-logger/my-logger.module';
import { MyLoggerService } from 'src/common/my-logger/my-logger.service';
import { GoogleStrategy } from './strategies/google.strategy';


@Module({
  imports: [
    UserModule,
    MyLoggerModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(configService.getOrThrow('JWT_EXPIRATION')),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    MyLoggerService,
    GoogleStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
