import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { EventsService } from './events.service';

import { FindEventsQueryDto } from './dto/find-events-query.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';

import { TimingInterceptor } from '../common/interceptors/timing.interceptor';

@Controller('events')
@UseInterceptors(TimingInterceptor)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Module 4: API key demonstration.
  // Also requires an authenticated STAFF or ADMIN account.
  @Post('guarded-demo')
  @UseGuards(JwtAuthGuard, RolesGuard, ApiKeyGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  createGuardedDemo(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  // Module 4: ParseIntPipe demonstration.
  @Get('example')
  findPage(@Query('page', ParseIntPipe) page: number) {
    return {
      page,
      message: 'Page received successfully',
    };
  }

  // STAFF and ADMIN can create events.
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  // Public browsing: only published events are returned.
  @Get()
  findAll(@Query() query: FindEventsQueryDto) {
    return this.eventsService.findAll(query);
  }

  // STAFF and ADMIN can view all events, including unpublished events.
  @Get('manage')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  findAllForStaff(@Query() query: FindEventsQueryDto) {
    return this.eventsService.findAllForStaff(query);
  }

  // STAFF and ADMIN can view sessions for published and draft events.
  @Get('manage/:id/sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  findSessionsForStaff(@Param('id') id: string) {
    return this.eventsService.findSessions(id);
  }
  // Only ADMIN can publish an event.
  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  publish(@Param('id') id: string) {
    return this.eventsService.setPublished(id, true);
  }

  // Only ADMIN can unpublish an event.
  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  unpublish(@Param('id') id: string) {
    return this.eventsService.setPublished(id, false);
  }
  // Public: published event details only.
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);

    if (!event.isPublished) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  // Public: sessions of published events only.
  @Get(':id/sessions')
  async findSessions(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);

    if (!event.isPublished) {
      throw new NotFoundException('Event not found');
    }

    return this.eventsService.findSessions(id);
  }

  // Public: individual sessions of published events only.
  @Get(':id/sessions/:sessionId')
  async findSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
  ) {
    const event = await this.eventsService.findOne(id);

    if (!event.isPublished) {
      throw new NotFoundException('Event not found');
    }

    return this.eventsService.findSession(id, sessionId);
  }

  // STAFF and ADMIN can create sessions.
  @Post(':id/sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  createSession(@Param('id') id: string, @Body() dto: CreateSessionDto) {
    return this.eventsService.createSession(id, dto);
  }

  // STAFF and ADMIN can update sessions.
  @Put(':id/sessions/:sessionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  updateSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.eventsService.updateSession(id, sessionId, dto);
  }

  // STAFF and ADMIN can delete sessions.
  @Delete(':id/sessions/:sessionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  removeSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.eventsService.removeSession(id, sessionId);
  }

  // Only ADMIN can delete events.
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  // STAFF and ADMIN can update events.
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }
}
