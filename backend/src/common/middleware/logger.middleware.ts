import { Injectable, NestMiddleware } from "@nestjs/common"
import { NextFunction, Request, Response } from "express"
import { AppLogger } from "../logger/app-logger"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now()
    const agent = req.headers["user-agent"] ?? "-"

    AppLogger.startRoute(`${req.method} ${req.originalUrl} HTTP/${req.httpVersion} ${agent}`)

    res.on("finish", () => {
      const duration = Date.now() - start
      AppLogger.finishRoute(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
        res.statusCode,
      )
    })

    next()
  }
}
