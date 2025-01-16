import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { ResponseEntity } from '../dto/response.entity';
import { Response } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common/exceptions';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const responseBody = ResponseEntity.ERROR(
      httpStatus,
      '오류가 발생했습니다.',
    );
    this.logger.error(
      `Http Status: ${httpStatus}, path: ${request.url}, message: ${exception.message}`,
      exception.stack,
    );

    response.status(httpStatus).json(responseBody);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseEntity = ResponseEntity.ERROR(status, exception.message);
    this.logger.error(
      `Http Status: ${status}, path: ${request.url}, message: ${exception.message}`,
      exception.stack,
    );

    response.status(status).json(responseEntity);
  }
}

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ForbiddenExceptionFilter.name);
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getResponse<Request>();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.FORBIDDEN;
    const responseEntity = ResponseEntity.ERROR(status, '권한이 없습니다.');

    this.logger.warn(
      `Http Status: ${status}, path: ${request.url}, message: ${exception.message}`,
      exception.stack,
    );

    response.status(status).json(responseEntity);
  }
}

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.UNAUTHORIZED;

    const responseEntity = ResponseEntity.ERROR(
      HttpStatus.UNAUTHORIZED,
      '로그인이 필요합니다.',
    );
    response.status(status).json(responseEntity);
  }
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BadRequestExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getResponse<Request>();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;
    const responseEntity = ResponseEntity.BAD_REQUEST(
      '요청이 잘못되었습니다.',
      exception.message,
    );

    this.logger.warn(
      `Http Status: ${status}, path: ${request.url}, message: ${exception.message}`,
      exception.stack,
    );

    response.status(status).json(responseEntity);
  }
}

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NotFoundExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getResponse<Request>();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.NOT_FOUND;
    const responseEntity = ResponseEntity.NOT_FOUND('찾을 수 없습니다.');

    // this.logger.warn(
    //   `Http Status: ${status}, path: ${request.url}, message: ${exception.message}`,
    //   exception.stack,
    // );

    response.status(status).json(responseEntity);
  }
}

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.NOT_FOUND;
    const responseEntity = ResponseEntity.NOT_FOUND('찾을 수 없습니다.');

    response.status(status).json(responseEntity);
  }
}
