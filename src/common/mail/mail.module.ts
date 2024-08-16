/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
    imports : [
        MailerModule.forRootAsync({
            imports: [ConfigModule], // Import ConfigModule to use ConfigService
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('MAIL_HOST'),
                    port: 465,
                    secure: true,
                    auth: {
                        user: configService.get<string>('MAIL_USER'),
                        pass: configService.get<string>('MAIL_PASS'),
                    },
                },
            }),
            inject: [ConfigService], // Inject ConfigService to use in the factory function
        }),
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
