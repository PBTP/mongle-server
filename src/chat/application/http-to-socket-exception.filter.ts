import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch(HttpException)
export class HttpToSocketExceptionFilter extends BaseWsExceptionFilter<HttpException> {
  // BaseWsExceptionFilter를 상속하면 Ws관련 Exception을 만들 수 있다.

  catch(exception: HttpException, host: ArgumentsHost): void {
    super.catch(exception, host);

    const socket = host.switchToWs().getClient(); // 소켓 가져오기
    socket.emit(
      // 현재 소켓에다가만 emit하기
      'exception', // 이벤트 이름
      {
        // 실제 응답에서 받는 {메세지 형태들}
        data: exception.getResponse(),
      },
    );
  }
}
