import {
  Body,
  Controller,
  Delete,
  Get,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator.js';
import { ProfileService } from './profile.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

const MAX_AVATAR_SIZE = 10 * 1024 * 1024;

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

  @Post('me/avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_AVATAR_SIZE, files: 1 },
    }),
  )
  updateAvatar(
    @CurrentUserId() userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_AVATAR_SIZE }),
          new FileTypeValidator({ fileType: /^image\// }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.profileService.updateAvatar(userId, file);
  }

  @Delete('me/avatar')
  @UseGuards(AuthGuard)
  deleteAvatar(@CurrentUserId() userId: string) {
    return this.profileService.deleteAvatar(userId);
  }

  @Get(':username')
  getPublicProfile(@Param('username') username: string) {
    return this.profileService.getPublicProfile(username);
  }
}
