import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard.js';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator.js';
import { CreateLinkDto } from './dto/create-link.dto.js';
import { LinksService } from './links.service.js';
import { ReorderLinksDto } from './dto/reorder-links.dto.js';
import { UpdateLinkDto } from './dto/update-link.dto.js';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@CurrentUserId() userId: string, @Body() dto: CreateLinkDto) {
    return this.linksService.create(userId, dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@CurrentUserId() userId: string) {
    return this.linksService.findAll(userId);
  }

  @Patch('reorder')
  @UseGuards(AuthGuard)
  reorder(@CurrentUserId() userId: string, @Body() dto: ReorderLinksDto) {
    return this.linksService.reorder(userId, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @CurrentUserId() userId: string,
    @Param('id') linkId: string,
    @Body() dto: UpdateLinkDto,
  ) {
    return this.linksService.update(userId, linkId, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@CurrentUserId() userId: string, @Param('id') linkId: string) {
    return this.linksService.delete(userId, linkId);
  }

  @Post(':id/click')
  async registerClick(@Param('id') linkId: string) {
    return this.linksService.registerClick(linkId);
  }
}
