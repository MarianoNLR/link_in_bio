import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator.js';
import { ProfileService } from './profile.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  getMyProfile(@CurrentUserId() userId: string) {
    return this.profileService.getMyProfile(userId);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  updateMyProfile(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateMyProfile(userId, dto);
  }

  @Get(':username')
  getPublicProfile(@Param('username') username: string) {
    return this.profileService.getPublicProfile(username);
  }
}