import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { Request, Response } from "express"
import { AppLogger } from "../logger/app-logger"

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()
    const request = host.switchToHttp().getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = "Internal server error"

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const body = exception.getResponse()
      if (typeof body === "string") {
        message = body
      } else {
        const raw = (body as { message?: string | string[] }).message
        message = Array.isArray(raw) ? raw[0] : (raw ?? message)
      }
    } else if (exception instanceof Error) {
      message = exception.message
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      AppLogger.error(`${request.method} ${request.originalUrl} ${status} - ${message}`)
      if (exception instanceof Error && exception.stack) {
        AppLogger.error(exception.stack)
      }
    } else if (status >= HttpStatus.BAD_REQUEST) {
      AppLogger.warn(`${request.method} ${request.originalUrl} ${status} - ${message}`)
    }

    response.status(status).json({ message })
  }
}
