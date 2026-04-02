import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + Number(this.configService.get('JWT_EXPIRATION')),
    );

    const token = await this.jwtService.signAsync(tokenPayload);
    response.cookie('Authentication', token, { httpOnly: true, expires });
  }
}
