/* eslint-disable prettier/prettier */
// src/common/decorators/log.decorator.ts
import { SetMetadata, applyDecorators, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

export function Log() {
  return applyDecorators(
    UseInterceptors(LoggingInterceptor),
  );
}
