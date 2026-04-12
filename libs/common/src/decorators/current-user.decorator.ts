interface RequestWithUser extends Request {
  user: User;
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../interfaces';

const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest<RequestWithUser>().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
