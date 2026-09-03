import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

type JwtPayload = {
  sub: string;
};

type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user!.sub;
  },
);