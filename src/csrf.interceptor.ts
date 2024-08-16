// /* eslint-disable prettier/prettier */
// import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable()
// export class CsrfInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const response = context.switchToHttp().getResponse();

//     response.setHeader('X-Apollo-Operation-Name', 'true');

//     return next.handle().pipe(
//       tap(() => {
//         // Any additional CSRF protection logic can be added here
//       }),
//     );
//   }
// }
