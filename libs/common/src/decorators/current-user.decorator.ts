import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserDocument } from '../models';

interface RequestWithUser extends Request {
  user: UserDocument;
}

const getCurrentUserByContext = (ctx: ExecutionContext): UserDocument => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx),
);
