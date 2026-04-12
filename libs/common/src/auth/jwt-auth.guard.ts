import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { User } from '../interfaces';

interface JwtAuthRequest extends Request {
  user: User;
  cookies: Record<string, string | undefined>;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest<JwtAuthRequest>();
    const jwt = request.cookies?.Authentication;

    if (!jwt) {
      return false;
    }

    return this.authClient
      .send<User>('authenticate', { Authentication: jwt })
      .pipe(
        tap((res) => {
          request.user = res;
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}
