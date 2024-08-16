/* eslint-disable prettier/prettier */
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return request;
      }
}