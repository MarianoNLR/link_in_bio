import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { UpdateProfileDto } from './dto/update-profile.dto.js';
import { CloudinaryService } from '../../cloudinary/cloudinary.service.js';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async updateAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        avatarPublicId: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uploaded = await this.cloudinary.uploadImage(file);

    const updatedProfile = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: uploaded.secureUrl,
        avatarPublicId: uploaded.publicId,
      },
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

    if (user.avatarPublicId) {
      await this.cloudinary.deleteImage(user.avatarPublicId);
    }

    return updatedProfile;
  }

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
