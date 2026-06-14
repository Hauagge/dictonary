import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { Response } from "express"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now()
    const response = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      tap(() => {
        if (!response.headersSent) {
          response.setHeader("x-response-time", `${Date.now() - start}ms`)
        }
      }),
    )
  }
}
