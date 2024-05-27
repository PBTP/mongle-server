import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SystemAlarmService } from '../system.alarm.service';
import { AuthService } from '../../auth/application/auth.service';

@Catch()
export class ExceptionsFilter {
  private readonly logger: Logger = new Logger(ExceptionsFilter.name);

  constructor(
    private readonly systemAlarmService: SystemAlarmService,
    private readonly authService: AuthService,
  ) {}

  public async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const curr = new Date();
    const datetime = new Date(
      curr.getTime() + curr.getTimezoneOffset() * 60 * 1000,
    );

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

    const { ip, method, headers } = req;

    const errorResponse = {
      timestamp: `${datetime}`,
      path: `${req.url}`,
      method: method,
      userAgent: req.get('user-agent'),
      statusCode: statusCode,
      message: message,
      payload: JSON.stringify(
        await this.authService.decodeToken(
          headers.authorization.replace('Bearer ', ''),
        ),
      ),
      stack: stack,
    };

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({
        err: { ip: ip, ...errorResponse },
        args: { req, res },
      });
    } else {
      this.logger.warn({ err: errorResponse });
    }

    await this.systemAlarmService
      .alarm(
        'logging',
        `\b
---------------------------------------------------------------------------
\b\n
🚨 ERROR! 🚨\n\n
⏰ TimeStamp: ${datetime}
🔗 Path: ${req.url}
📝 Method: ${method}
📱 User-Agent: ${req.get('user-agent')}
🛑 StatusCode: ${statusCode}
📢 Message: ${message}
🧑‍💼 PayLoad: ${errorResponse.payload}\n\n
💥 StackTrace:\n${stack}\n\n\b
---------------------------------------------------------------------------\n\n\b`,
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
