import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Event, EventSession } from './event.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';

interface EventsFile {
  events: Event[];
  sessions: EventSession[];
}

@Injectable()
export class EventsService {
  private readonly filePath = join(process.cwd(), 'data', 'events.json');

  private async readData(): Promise<EventsFile> {
    try {
      const content = await readFile(this.filePath, 'utf8');

      // Remove a possible UTF-8 BOM created by Windows PowerShell.
      const cleanContent = content.replace(/^\uFEFF/, '');

      return JSON.parse(cleanContent) as EventsFile;
    } catch (error) {
      console.error('Could not read events.json:', error);

      throw new InternalServerErrorException('Could not read event data');
    }
  }

  private async writeData(data: EventsFile): Promise<void> {
    try {
      await writeFile(
        this.filePath,
        JSON.stringify(data, null, 2) + '\n',
        'utf8',
      );
    } catch (error) {
      console.error('Could not save events.json:', error);

      throw new InternalServerErrorException('Could not save event data');
    }
  }

  async create(dto: CreateEventDto): Promise<Event> {
    const data = await this.readData();

    const eventDate = new Date(dto.eventDate);

    if (Number.isNaN(eventDate.getTime())) {
      throw new BadRequestException('Invalid event date');
    }

    const event: Event = {
      id: `evt-${Date.now()}`,
      title: dto.title,
      description: dto.description,
      location: dto.location,
      eventDate: eventDate.toISOString(),
      category: dto.category,
      isPublished: dto.isPublished ?? false,
    };

    data.events.push(event);

    await this.writeData(data);

    return event;
  }

  async findAll(query: FindEventsQueryDto) {
    if (
      query.isPublished !== undefined &&
      !['true', 'false'].includes(query.isPublished)
    ) {
      throw new BadRequestException('isPublished must be true or false');
    }

    const sortBy = query.sortBy ?? 'eventDate';
    const order = query.order ?? 'asc';

    if (!['eventDate', 'title'].includes(sortBy)) {
      throw new BadRequestException('Unsupported sort field');
    }

    if (!['asc', 'desc'].includes(order)) {
      throw new BadRequestException('Order must be asc or desc');
    }

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 5);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      throw new BadRequestException('Page and limit must be positive integers');
    }

    const data = await this.readData();

    let filtered = data.events.filter((event) => {
      const publishedMatches =
        query.isPublished !== undefined
          ? event.isPublished === (query.isPublished === 'true')
          : true;

      const categoryMatches = query.category
        ? event.category.toLowerCase() === query.category.toLowerCase()
        : true;

      const locationMatches = query.location
        ? event.location.toLowerCase().includes(query.location.toLowerCase())
        : true;

      return publishedMatches && categoryMatches && locationMatches;
    });

    filtered.sort((a, b) => {
      let comparison: number;

      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else {
        comparison =
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      }

      return order === 'asc' ? comparison : -comparison;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUpcoming(): Promise<Event[]> {
    const data = await this.readData();
    const now = Date.now();

    return data.events
      .filter((event) => new Date(event.eventDate).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
      );
  }

  async findOne(id: string): Promise<Event> {
    const data = await this.readData();

    const event = data.events.find((item) => item.id === id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async remove(id: string): Promise<Event> {
    const data = await this.readData();

    const index = data.events.findIndex((event) => event.id === id);

    if (index === -1) {
      throw new NotFoundException('Event not found');
    }

    const [deletedEvent] = data.events.splice(index, 1);

    // Remove sessions belonging to the deleted event.
    data.sessions = data.sessions.filter((session) => session.eventId !== id);

    await this.writeData(data);

    return deletedEvent;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const data = await this.readData();

    const index = data.events.findIndex((event) => event.id === id);

    if (index === -1) {
      throw new NotFoundException('Event not found');
    }

    const existingEvent = data.events[index];

    let eventDate = existingEvent.eventDate;

    if (dto.eventDate !== undefined) {
      const parsedDate = new Date(dto.eventDate);

      if (Number.isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid event date');
      }

      eventDate = parsedDate.toISOString();
    }

    const updatedEvent: Event = {
      ...existingEvent,
      ...dto,
      eventDate,
    };

    data.events[index] = updatedEvent;

    await this.writeData(data);

    return updatedEvent;
  }

  async findSessions(eventId: string): Promise<EventSession[]> {
    await this.findOne(eventId);

    const data = await this.readData();

    return data.sessions
      .filter((session) => session.eventId === eventId)
      .sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      );
  }

  async findSession(eventId: string, sessionId: string): Promise<EventSession> {
    await this.findOne(eventId);

    const data = await this.readData();

    const session = data.sessions.find(
      (item) => item.id === sessionId && item.eventId === eventId,
    );

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }
}
