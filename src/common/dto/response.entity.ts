import { HttpStatus } from '@nestjs/common';

export class ResponseEntity<T> {
  statusCode: number;
  message: string;
  data?: T;

  private constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static SUCCESS<T>(
    statusCode: number,
    message: string,
    data: T,
  ): ResponseEntity<T> {
    return new ResponseEntity(statusCode, message, data);
  }

  static OK<T>(data: T, message: string = 'OK'): ResponseEntity<T> {
    return ResponseEntity.SUCCESS(HttpStatus.OK, message, data);
  }

  static ERROR(statusCode: number, message: string): ResponseEntity<null> {
    return new ResponseEntity(statusCode, message, null);
  }

  static NOT_FOUND(message: string = 'Not Found'): ResponseEntity<null> {
    return ResponseEntity.ERROR(HttpStatus.NOT_FOUND, message);
  }
}
