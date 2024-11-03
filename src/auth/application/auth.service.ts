import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CACHE_SERVICE, ICacheService } from '../../common/cache/cache.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { UserService } from './user.service';
import { UserDto } from '../presentation/user.dto';
import { AuthDto } from '../presentation/auth.dto';

@Injectable()
export class AuthService {
  private readonly accessTokenOption: JwtSignOptions;
  private readonly refreshTokenOption: JwtSignOptions;
  private readonly accessTokenStrategy: string;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_SERVICE)
    private readonly cacheService: ICacheService,
    private readonly userService: UserService,
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
  }

  async login(dto: UserDto): Promise<AuthDto> {
    let user: UserDto | null = await this.userService.findOne(dto);
    user = user ?? (await this.userService.create(dto));
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

    return {
      uuid: user.uuid,
      name: user.name,
      userId: user.userId,
      userType: user.userType ?? dto.userType,
      phoneNumber: user.phoneNumber,
      authProvider: user.authProvider,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async tokenRefresh(
    request: Request & { headers: { authorization?: string } },
  ): Promise<AuthDto> {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Authorization 헤더에 토큰이 없습니다.');
    }

    const payload = this.jwtService.decode(token);

    console.log('payload', payload);

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

    if (this.accessTokenStrategy?.toLowerCase() === 'unique') {
      this.cacheService.get(key).then((v) => {
        if (v) {
          this.cacheService.del(v);
        }
      });

      await this.cacheService.set(
        key,
        accessToken,
        (this.accessTokenOption.expiresIn as number) / 1000,
      );
    }

    await this.cacheService.set(
      accessToken,
      JSON.stringify({
        ...user,
        refreshToken: undefined,
      }),
      (this.accessTokenOption.expiresIn as number) / 1000,
    );
  }

  async decode(token: string): Promise<any> {
    return await this.jwtService.decode(token);
  }

  async getUser(token: string): Promise<any> {
    const payload = await this.jwtService.verify(token);
    if (!payload) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }

    return await this.userService.findOne({
      userType: payload.userType,
      userId: payload.subject,
    });
  }
}
