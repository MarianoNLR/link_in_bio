import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { Post, Body } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import type { Request, Response, CookieOptions } from 'express';
import { AuthGuard } from './guards/auth.guard.js';
import { CurrentUserId } from './decorators/current-user-id.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.setSessionCookie(
      response,
      await this.authService.register(dto),
    );
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.setSessionCookie(response, await this.authService.login(dto));
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = request.headers.cookie
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('refreshToken='))
      ?.slice('refreshToken='.length);
    try {
      if (!token || !/^[0-9a-f-]{36}\.[A-Za-z0-9_-]{43}$/.test(token)) {
        throw new UnauthorizedException('Missing or invalid refresh cookie');
      }
      return this.setSessionCookie(
        response,
        await this.authService.refresh(token),
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        response.clearCookie('refreshToken', this.cookieOptions());
      }
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = request.headers.cookie
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('refreshToken='))
      ?.slice('refreshToken='.length);
    await this.authService.logout(token);
    response.clearCookie('refreshToken', this.cookieOptions());
    response.setHeader('Cache-Control', 'no-store');
  }

  private cookieOptions(): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/auth',
    };
  }

  private setSessionCookie<
    T extends { refreshToken: string; refreshTokenExpiresAt: Date },
  >(response: Response, result: T) {
    const { refreshToken, refreshTokenExpiresAt, ...body } = result;
    response.cookie('refreshToken', refreshToken, {
      ...this.cookieOptions(),
      expires: refreshTokenExpiresAt,
    });
    response.setHeader('Cache-Control', 'no-store');
    return body;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUserId() userId: string) {
    return this.authService.getMe(userId);
  }
}
