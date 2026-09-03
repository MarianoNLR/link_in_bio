import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        theme: true,
        isPublic: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Profile not found');
    }

    return user;
  }

  async updateMyProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: dto.username },
        select: { id: true },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Username already in use');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        theme: true,
        isPublic: true,
      },
    });
  }

  async getPublicProfile(username: string) {
    const profile = await this.prisma.user.findUnique({
      where: {
        username,
        isPublic: true,
      },
      select: {
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        theme: true,
        links: {
          where: {
            isActive: true,
          },
          orderBy: {
            position: 'asc',
          },
          select: {
            id: true,
            title: true,
            url: true,
            position: true,
            platform: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
}
