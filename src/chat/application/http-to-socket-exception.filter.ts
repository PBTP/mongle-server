import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch(HttpException)
export class HttpToSocketExceptionFilter extends BaseWsExceptionFilter<HttpException> {
  private readonly logger = new Logger(HttpToSocketExceptionFilter.name);

  // BaseWsExceptionFilter를 상속하면 Ws관련 Exception을 만들 수 있다.

  catch(exception: HttpException, host: ArgumentsHost): void {
    const status = exception.getStatus();
    if (500 <= status) {
      this.logger.error('Server error', exception.message);
    }

    if (400 <= status && status < 500) {
      this.logger.warn('BadRequest', exception.message);
    }

    const socket = host.switchToWs().getClient(); // 소켓 가져오기
    socket.emit('exception', exception.getResponse());
  }
}
