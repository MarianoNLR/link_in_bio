import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

// Simple rate limiting guard for profile view requests. 
// It limits the number of requests from a single IP address within a specified time window.
// The default configuration allows 1 request per 30 minutes.

// Improvements could include: Redis + cookie-based rate limiting, more sophisticated tracking of requests.
type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const DEFAULT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const DEFAULT_MAX_REQUESTS = 1; // 1 request per window

@Injectable()
export class ProfileViewRateLimitGuard implements CanActivate {
  private readonly requestsByIp = new Map<string, RateLimitEntry>();
  private readonly windowMs = this.readPositiveInteger(
    process.env.PROFILE_VIEW_RATE_LIMIT_WINDOW_MS,
    DEFAULT_WINDOW_MS,
  );
  private readonly maxRequests = this.readPositiveInteger(
    process.env.PROFILE_VIEW_RATE_LIMIT_MAX,
    DEFAULT_MAX_REQUESTS,
  );

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip || request.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const current = this.requestsByIp.get(ip);

    if (!current || current.resetAt <= now) {
      this.requestsByIp.set(ip, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (current.count >= this.maxRequests) {
      throw new HttpException(
        'Too many profile view requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    current.count += 1;
    return true;
  }

  private readPositiveInteger(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }
}
