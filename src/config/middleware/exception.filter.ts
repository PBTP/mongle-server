import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SystemAlarmService } from '../system.alarm.service';

@Catch()
export class ExceptionsFilter {
  private readonly logger: Logger = new Logger();

  constructor(private readonly systemAlarmService: SystemAlarmService) {}

  public async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const datetime = new Date();

    let message: string;
    let statusCode: HttpStatus;
    let stack: string;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
      stack = exception.stack;
    } else if (exception instanceof Error) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      stack = exception.stack;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'UNKNOWN ERROR';
    }

    const errorResponse = {
      statusCode: statusCode,
      timestamp: datetime,
      path: req.url,
      method: req.method,
      message: message,
    };

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ err: errorResponse, args: { req, res } });
    } else {
      this.logger.warn({ err: errorResponse });
    }

    await this.systemAlarmService
      .alarm(
        'logging',
        `\b🚨 ERROR! 🚨\n\n
        statusCode: ${statusCode}
        timestamp: ${datetime.toISOString()}
        path: ${req.url}
        method: ${req.method}
        message: ${message}
        stackTrace:\n${stack}\n\n\b`,
      )
      .catch((e) => {
        this.logger.error('Failed to send alarm', e.message, e.stack);
      });

    res.status(statusCode).json(errorResponse);
  }
  private getHttpStatus(exception: unknown): HttpStatus {
    if (exception instanceof HttpException) return exception.getStatus();
    else return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
