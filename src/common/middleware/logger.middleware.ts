import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const requestPath = req.path;

    console.log(`Incoming Request: ${req.method} ${requestPath}`);

    res.on('finish', () => {
      const duration = Date.now() - startTime;

      console.log(
        `Response: ${req.method} ${requestPath} | Status: ${res.statusCode} | ${duration}ms`,
      );
    });

    next();
  }
}