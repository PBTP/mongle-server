import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CACHE_SERVICE, ICacheService } from '@common/cache/cache.service';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { UserService } from './user.service';
import { UserDto } from '../presentation/user.dto';
import { AuthDto } from '../presentation/auth.dto';
import { Builder } from 'builder-pattern';
import { ISecurityService, SECURITY_SERVICE } from './security.service';
import { Sender } from '@common/sender/sender.interface';
import {
  ISmsService,
  SMS_SERVICE,
} from '@common/sender/sms/application/sms.service';

@Injectable()
export class AuthService {
  private readonly accessTokenOption: JwtSignOptions;
  private readonly refreshTokenOption: JwtSignOptions;
  private readonly accessTokenStrategy: string;
  private readonly logger = new Logger(AuthService.name);
  private readonly senders: {
    [key: string]: Sender;
  } = {};

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @Inject(SECURITY_SERVICE)
    private readonly securityService: ISecurityService,
    @Inject(CACHE_SERVICE)
    private readonly cacheService: ICacheService,
    @Inject(SMS_SERVICE)
    private readonly smsService: ISmsService,
  ) {
    this.accessTokenOption = {
      secret: this.configService.get<string>('jwt/access/secret'),
      expiresIn: this.configService.get<number>('jwt/access/expire'),
    };

    this.refreshTokenOption = {
      secret: this.configService.get<string>('jwt/refresh/secret'),
      expiresIn: this.configService.get<number>('jwt/refresh/expire'),
    };

    this.accessTokenStrategy = <string>(
      this.configService.get('jwt/access/strategy')
    );

    this.senders.sms = this.smsService;
  }

  async login(dto: UserDto): Promise<AuthDto> {
    const user: UserDto = await this.userService
      .findOne(dto)
      .then(async (user) => {
        return user ?? (await this.userService.create(dto));
      });

    user.userId = user.customerId ?? user.driverId ?? user.businessId;

    user.userType = dto.userType;

    if (!user.userType) {
      throw new UnauthorizedException('사용자 타입이 없습니다.');
    }
    if (!user.userId) {
      throw new UnauthorizedException('사용자 아이디가 없습니다.');
    }

    const accessToken = this.jwtService.sign(
      {
        tokenType: 'access',
        subject: user.userId,
        userType: user.userType,
      },
      this.accessTokenOption,
    );

    await this.saveAccessToken(user, accessToken);

    const refreshToken = this.jwtService.sign(
      {
        tokenType: 'refresh',
        subject: user.userId,
        userType: user.userType,
      },
      this.refreshTokenOption,
    );

    await this.userService.update({
      userId: user.userId,
      userType: user.userType,
      refreshToken: refreshToken,
    });

    return Builder(AuthDto)
      .uuid(user.uuid)
      .name(dto.name)
      .userId(user.userId)
      .userType(user.userType)
      .phoneNumber(user.phoneNumber)
      .authProvider(user.authProvider)
      .accessToken(accessToken)
      .refreshToken(refreshToken)
      .build();
  }

  async tokenRefresh(token: string): Promise<AuthDto> {
    if (!token) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const payload = this.jwtService.decode(token);

    if (!payload) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }

    const user: UserDto = await this.userService.getOne({
      userType: payload.userType,
      userId: payload.subject,
    });

    const accessToken = this.jwtService.sign(
      {
        tokenType: 'access',
        subject: user.userId,
        userType: user.userType,
      },
      this.accessTokenOption,
    );

    const refreshToken = this.jwtService.sign(
      {
        tokenType: 'refresh',
        subject: user.userId!,
        userType: user.userType,
      },
      this.refreshTokenOption,
    );

    await this.saveAccessToken(user, accessToken);

    await this.userService.update({
      userId: user.userId,
      userType: user.userType,
      refreshToken: refreshToken,
    });

    const userDto = this.userService.toUserDto(user);
    return {
      ...userDto,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async saveAccessToken(user: UserDto, accessToken: string) {
    if (!user.userType && !user.userId) {
      this.logger.error('사용자 정보가 없습니다.');
      throw new UnauthorizedException('사용자 정보가 없습니다.');
    }

    const key = `${user.userType}:${user.userId}:accessToken`;
    const uniqueStrategy = this.accessTokenStrategy?.toLowerCase() === 'unique';

    if (uniqueStrategy) {
      const existingToken = await this.cacheService.get(key);
      if (existingToken) await this.cacheService.del(existingToken);
    }

    await this.cacheService.set(
      key,
      accessToken,
      (this.accessTokenOption.expiresIn as number) / 1000,
    );

    await this.cacheService.set(
      accessToken,
      JSON.stringify({
        ...user,
        refreshToken: undefined,
      }),
      (this.accessTokenOption.expiresIn as number) / 1000,
    );

    await this.cacheService.set(
      accessToken,
      JSON.stringify({
        ...user,
        refreshToken: undefined,
      }),
      (this.accessTokenOption.expiresIn as number) / 1000,
    );
  }

  async getUser(token: string): Promise<any> {
    const payload = await this.jwtService.verify(token);
    if (!payload) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }

    return await this.userService.getOne({
      userType: payload.userType,
      userId: payload.subject,
    });
  }

  async generateOtp(secret: string): Promise<string> {
    return await this.securityService.generateOtp(secret);
  }

  async sendOtp(sendType: string, secret: string): Promise<string> {
    return await this.generateOtp(secret).then(async (otp) => {
      const message = `몽글\n인증번호는 [${otp}] 입니다.`;
      const sender = this.senders[sendType];

      if (!sender) {
        throw new BadRequestException('지원하지 않는 전송 방식입니다.');
      }

      await sender.send(secret, message);
      return otp;
    });
  }

  async otpVerifyAndUserUpdate(
    user: UserDto,
    secret: string,
    otp: string,
  ): Promise<boolean> {
    if (await this.securityService.validateOtp(secret, otp)) {
      user.phoneNumber = secret;
      await this.userService.update(user);
      return true;
    }

    return false;
  }
}
