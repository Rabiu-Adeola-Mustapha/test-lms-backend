/* eslint-disable prettier/prettier */
require("dotenv").config();
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    // MailerModule.forRootAsync({
    //     imports: [ConfigModule], // Import ConfigModule to use ConfigService
    //     useFactory: async (configService: ConfigService) => ({
    //         transport: {
    //             host: configService.get<string>('MAIL_HOST'),
    //             port: 465,
    //             secure: true,
    //             auth: {
    //                 user: configService.get<string>('MAIL_USER'),
    //                 pass: configService.get<string>('MAIL_PASS'),
    //             },
    //         },
    //     }),
    //     inject: [ConfigService], // Inject ConfigService to use in the factory function
    // }),

    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
        defaults: {
          from: '"Mcanderson Institute" support@mivant.co', // Make sure this domain is correctly configured
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
