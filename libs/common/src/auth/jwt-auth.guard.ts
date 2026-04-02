import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { map, Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';

interface AuthenticatedUser {
  userId: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  cookies: Record<string, string | undefined>;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const jwt = request.cookies?.Authentication;

    if (!jwt) {
      return false;
    }

    return this.authClient
      .send<AuthenticatedUser>('authenticate', { Authentication: jwt })
      .pipe(
        tap((res) => {
          request.user = res;
        }),
        map(() => true),
      );
  }
}
