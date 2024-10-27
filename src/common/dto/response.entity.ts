export class ResponseEntity<T> {
  statusCode: number;
  message: string;
  data: T;

  private constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
