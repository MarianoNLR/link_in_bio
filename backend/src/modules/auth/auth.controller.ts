import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { Post, Body } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthGuard } from './guards/auth.guard.js';
import { CurrentUserId } from './decorators/current-user-id.decorator.js';
  
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUserId() userId: string) {
    return this.authService.getMe(userId);
  }
}
