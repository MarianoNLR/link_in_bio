import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller.js';
import { ProfileService } from './profile.service.js';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module.js';
import { ProfileViewRateLimitGuard } from './guards/profile-view-rate-limit.guard.js';

@Module({
  imports: [CloudinaryModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileViewRateLimitGuard],
})
export class ProfileModule {}
