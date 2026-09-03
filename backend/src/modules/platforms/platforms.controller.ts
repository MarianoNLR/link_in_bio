import { Controller, Get } from '@nestjs/common';
import { PlatformsService } from './platforms.service.js';

@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Get()
  getAllPlatforms() {
    return this.platformsService.getAllPlatforms();
  }
}
