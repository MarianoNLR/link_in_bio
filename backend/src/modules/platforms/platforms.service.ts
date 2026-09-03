import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class PlatformsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPlatforms() {
    return this.prisma.platform.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }
}
