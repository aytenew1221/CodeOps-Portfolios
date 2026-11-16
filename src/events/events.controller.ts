
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from './events.service';

import { FindEventsQueryDto } from './dto/find-events-query.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // ADMIN and STAFF can create events.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  // Public visitors can only see published events.
  @Get()
  findAll(@Query() query: FindEventsQueryDto) {
    return this.eventsService.findAll(query);
  }

  // ADMIN and STAFF can see all events, including unpublished ones.
  @Get('manage')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  findAllForStaff(@Query() query: FindEventsQueryDto) {
    return this.eventsService.findAllForStaff(query);
  }

  // Public event details: only published events are visible.
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);

    if (!event.isPublished) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  // Public session listing.
  @Get(':id/sessions')
  async findSessions(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);

    if (!event.isPublished) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException('Event not found');
    }

    return this.eventsService.findSessions(id);
  }

  @Get(':id/sessions/:sessionId')
  async findSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
  ) {
    const event = await this.eventsService.findOne(id);

    if (!event.isPublished) {
      const { NotFoundException } = await import('@nestjs/common');
      throw new NotFoundException('Event not found');
    }

    return this.eventsService.findSession(id, sessionId);
  }

  // Only ADMIN can delete events.
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  // ADMIN and STAFF can update events.
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }
}
