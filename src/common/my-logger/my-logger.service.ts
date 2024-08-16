/* eslint-disable prettier/prettier */
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { LogsRepository } from './logs.repository';

@Injectable()
export class MyLoggerService extends ConsoleLogger {

    constructor(
        private readonly logsRepository : LogsRepository,
    ){
        super();
        console.log('LogsRepository initialized:', this.logsRepository); 
    }

    async log(message: any, context?: string) {

        const entry = `${context}\t${message}`;

        super.log(message, context);

        await this.logsRepository.create({
            level: 'log', 
            message, 
            context, 
            timestamp: new Date() //.getTime
        });
    } 

    async error(message: any, stack?: string, context?: string) {

        const entry = `${stack}\t${message}`;

        super.error(message, stack);

        await this.logsRepository.create({
            level: 'error', 
            message,  
            stack, 
            context,
            timestamp: new Date() //.getTime
        });
    }
}
