import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
} from '@nestjs/common';

import { EventsService } from './events.service';

import { FindEventsQueryDto } from './dto/find-events-query.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindEventsQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Get('manage')
  findAllForStaff(@Query() query: FindEventsQueryDto) {
    return this.eventsService.findAllForStaff(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);

    if (!event.isPublished) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  @Get(':id/sessions')
  async findSessions(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);

    if (!event.isPublished) {
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
      throw new NotFoundException('Event not found');
    }

    return this.eventsService.findSession(id, sessionId);
  }

  @Post(':id/sessions')
  createSession(@Param('id') id: string, @Body() dto: CreateSessionDto) {
    return this.eventsService.createSession(id, dto);
  }

  @Put(':id/sessions/:sessionId')
  updateSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.eventsService.updateSession(id, sessionId, dto);
  }

  @Delete(':id/sessions/:sessionId')
  removeSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.eventsService.removeSession(id, sessionId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }
}
