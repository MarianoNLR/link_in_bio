import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateLinkDto } from './dto/create-link.dto.js';
import { UpdateLinkDto } from './dto/update-link.dto.js';
import { ReorderLinksDto } from './dto/reorder-links.dto.js';

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateLinkDto) {
    return this.prisma.$transaction(async (tx) => {
      const linkCount = await tx.link.count({
        where: { userId },
      });

      if (linkCount >= 15) {
        throw new BadRequestException('Maximum number of links reached');
      }

      let title = dto.title?.trim();
      let platformId: string | null = null;

      if (dto.platformId) {
        const platform = await tx.platform.findUnique({
          where: {
            id: dto.platformId,
          },
          select: {
            id: true,
            name: true,
          },
        });

        if (!platform) {
          throw new NotFoundException('Platform not found');
        }

        platformId = platform.id;
        title ||= platform.name;
      }

      if (!title) {
        throw new BadRequestException('Title is required for custom links');
      }

      const position = dto.position ?? linkCount;

      if (position < 0 || position > linkCount) {
        throw new BadRequestException('Invalid position');
      }

      if (position < linkCount) {
        const linksToMove = await tx.link.findMany({
          where: {
            userId,
            position: {
              gte: position,
            },
          },
          orderBy: {
            position: 'asc',
          },
          select: {
            id: true,
            position: true,
          },
        });

        for (const link of linksToMove) {
          await tx.link.update({
            where: {
              id: link.id,
            },
            data: {
              position: -(link.position + 1),
            },
          });
        }

        for (const link of linksToMove) {
          await tx.link.update({
            where: {
              id: link.id,
            },
            data: {
              position: link.position + 1,
            },
          });
        }
      }

      return tx.link.create({
        data: {
          title,
          url: dto.url,
          position,
          userId,
          platformId,
        },
        select: {
          id: true,
          title: true,
          url: true,
          position: true,
          isActive: true,
          clickCount: true,
          platform: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  }

  async findAll(userId: string) {
    return this.prisma.link.findMany({
      where: { userId },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        title: true,
        url: true,
        position: true,
        clickCount: true,
        isActive: true,
        platform: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(userId: string, linkId: string, dto: UpdateLinkDto) {
    const link = await this.prisma.link.findFirst({
      where: { id: linkId, userId },
      select: { userId: true },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    if (dto.platformId) {
      const platform = await this.prisma.platform.findUnique({
        where: {
          id: dto.platformId,
        },
        select: {
          id: true,
        },
      });

      if (!platform) {
        throw new NotFoundException('Platform not found');
      }
    }

    return this.prisma.link.update({
      where: { id: linkId },
      data: dto,
      select: {
        id: true,
        title: true,
        url: true,
        position: true,
        isActive: true,
        clickCount: true,
        platform: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(userId: string, linkId: string) {
    const link = await this.prisma.link.findFirst({
      where: { id: linkId, userId },
      select: { position: true },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.link.delete({
        where: { id: linkId },
      });

      const linksToMove = await tx.link.findMany({
        where: {
          userId,
          position: {
            gt: link.position,
          },
        },
        orderBy: {
          position: 'asc',
        },
        select: {
          id: true,
          position: true,
        },
      });

      for (const link of linksToMove) {
        await tx.link.update({
          where: {
            id: link.id,
          },
          data: {
            position: -(link.position - 1),
          },
        });
      }

      for (const link of linksToMove) {
        await tx.link.update({
          where: {
            id: link.id,
          },
          data: {
            position: link.position - 1,
          },
        });
      }
    });
  }

  async reorder(userId: string, dto: ReorderLinksDto) {
    return this.prisma.$transaction(async (tx) => {
      const userLinks = await tx.link.findMany({
        where: { userId },
        select: {
          id: true,
          position: true,
        },
        orderBy: {
          position: 'asc',
        },
      });

      if (dto.linkIds.length !== userLinks.length) {
        throw new BadRequestException('Invalid links list');
      }

      const userLinkIds = new Set(userLinks.map((link) => link.id));

      for (const linkId of dto.linkIds) {
        if (!userLinkIds.has(linkId)) {
          throw new BadRequestException('Invalid link');
        }
      }

      // 1. Liberamos las posiciones reales usando valores negativos.
      for (const link of userLinks) {
        await tx.link.update({
          where: {
            id: link.id,
          },
          data: {
            position: -(link.position + 1),
          },
        });
      }

      // 2. Asignamos el nuevo orden.
      for (const [position, linkId] of dto.linkIds.entries()) {
        await tx.link.update({
          where: {
            id: linkId,
          },
          data: {
            position,
          },
        });
      }

      return tx.link.findMany({
        where: { userId },
        orderBy: {
          position: 'asc',
        },
        select: {
          id: true,
          title: true,
          url: true,
          position: true,
          isActive: true,
          clickCount: true,
          platform: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  }

  async registerClick(linkId: string) {
    const link = await this.prisma.link.findFirst({
      where: {
        id: linkId,
        isActive: true,
        user: {
          isPublic: true,
        },
      },
      select: {
        id: true,
      },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    await this.prisma.link.update({
      where: {
        id: linkId,
      },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
    };
  }
}
