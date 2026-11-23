import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";

import { Observable, tap } from "rxjs";

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const start = Date.now();

    const request = context
      .switchToHttp()
      .getRequest();

    console.log("Request started:", request.originalUrl);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;

        console.log(
          `Request completed in ${duration}ms`,
        );
      }),
    );
  }
}
