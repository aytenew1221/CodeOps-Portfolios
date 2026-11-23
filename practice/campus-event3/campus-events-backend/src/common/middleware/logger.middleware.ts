import {
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import {
  Request,
  Response,
  NextFunction,
} from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const requestTime = new Date().toLocaleTimeString();

    console.log("--------------------------------");
    console.log("Campus Events Request");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Time:", requestTime);
    console.log("--------------------------------");

    next();
  }
}
