import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { ResponseEntity } from '../dto/response.entity';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any | Promise<ResponseEntity<any>>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((result: ResponseEntity<any>) => {
        response.status(result.statusCode);
        return result.data;
      }),
    );
  }
}
