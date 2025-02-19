import { HttpStatus } from '@nestjs/common';

export class ResponseEntity<T> {
  data?: T;
  message: string;
  statusCode: number;
  secretMessage?: string;

  private constructor(
    statusCode: number,
    message: string,
    data: T,
    secretMessage: string | undefined = undefined,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.secretMessage = secretMessage;
  }

  static SUCCESS<T>(
    statusCode: number,
    message: string,
    data: T,
  ): ResponseEntity<T> {
    return new ResponseEntity(statusCode, message, data);
  }

  static CREATED<T>(data: T, message: string = 'Created'): ResponseEntity<T> {
    return ResponseEntity.SUCCESS(HttpStatus.CREATED, message, data);
  }

  static OK<T>(data: T, message: string = 'OK'): ResponseEntity<T> {
    return ResponseEntity.SUCCESS(HttpStatus.OK, message, data);
  }

  static ERROR(
    statusCode: number,
    message: string,
    secretMessage: string | undefined = undefined,
  ): ResponseEntity<null> {
    return new ResponseEntity(statusCode, message, null, secretMessage);
  }

  static BAD_REQUEST(
    message: string = 'Bad Request',
    secretMessage: string | undefined = undefined,
  ): ResponseEntity<null> {
    return ResponseEntity.ERROR(HttpStatus.BAD_REQUEST, message, secretMessage);
  }

  static NOT_FOUND(message: string = 'Not Found'): ResponseEntity<null> {
    return ResponseEntity.ERROR(HttpStatus.NOT_FOUND, message);
  }
}
