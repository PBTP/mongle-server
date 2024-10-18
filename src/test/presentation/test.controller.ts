import { Controller, Get } from '@nestjs/common';
import { TestService } from '../application/test.service';
import { UserDto } from '../../auth/presentation/user.dto';

@Controller('/test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('/random/user')
  async randomUserUuid(): Promise<UserDto> {
    return await this.testService.randomUserUuid();
  }
}
