import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload): { userId: string; email: string } {
    if (!payload) {
      throw new UnauthorizedException('Invalid payload: payload is required');
    }
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid payload: sub is required');
    }
    if (!payload.email) {
      throw new UnauthorizedException('Invalid payload: email is required');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
