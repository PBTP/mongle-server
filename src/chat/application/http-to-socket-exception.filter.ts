import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch(HttpException)
export class HttpToSocketExceptionFilter extends BaseWsExceptionFilter<HttpException> {
  // BaseWsExceptionFilter를 상속하면 Ws관련 Exception을 만들 수 있다.

  catch(exception: HttpException, host: ArgumentsHost): void {
    const socket = host.switchToWs().getClient(); // 소켓 가져오기
    socket.emit('exception', exception.getResponse());
  }
}
