import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../common/cache/cache.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { UserService } from './user.service';
import { UserDto } from '../presentation/user.dto';
import { AuthDto } from '../presentation/auth.dto';

@Injectable()
export class AuthService {
  private readonly accessTokenOption: JwtSignOptions;
  private readonly refreshTokenOption: JwtSignOptions;
  private readonly accessTokenStrategy: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
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

    this.accessTokenStrategy = this.configService.get<string>(
      'jwt/access/strategy',
    );
  }

  async login(dto: UserDto): Promise<AuthDto> {
    let user: UserDto = await this.userService.findOne(dto);
    user = user ?? (await this.userService.create(dto));

    user.userId = user['customerId'] ?? user['driverId'] ?? user['businessId'];
    user.userType = dto.userType;

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
      ...user,
      userType: user.userType,
      refreshToken: refreshToken,
    });

    return {
      uuid: user.uuid,
      name: user.name,
      userId: user.userId,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
      authProvider: user.authProvider,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async tokenRefresh(request: Request): Promise<AuthDto> {
    const token = request.headers['authorization'].replace('Bearer ', '');

    const payload = this.jwtService.decode(token);

    const user: UserDto = await this.userService.findOne({
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
        subject: user.userId,
        userType: user.userType,
      },
      this.refreshTokenOption,
    );

    await this.saveAccessToken(user, accessToken);

    await this.userService.update({
      ...user,
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
    const key = `${user.userType}:${user.userId}:accessToken`;

    if (this.accessTokenStrategy.toLowerCase() === 'unique') {
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
      throw new UnauthorizedException();
    }

    return await this.userService.findOne({
      userType: payload.userType,
      userId: payload.subject,
    });
  }
}
