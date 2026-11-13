import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { events, sessions } from './events.data';
import { Event, EventSession } from './event.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  create(dto: CreateEventDto): Event {
    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      title: dto.title,
      description: dto.description,
      location: dto.location,
      eventDate: dto.eventDate,
      category: dto.category,
      isPublished: dto.isPublished,
    };

    events.push(newEvent);

    return newEvent;
  }

  findAll(query: FindEventsQueryDto) {
    let result = [...events];

    // Show published events by default.
    // Allow explicitly requesting published or unpublished events.
    if (query.isPublished !== undefined) {
      if (!['true', 'false'].includes(query.isPublished)) {
        throw new BadRequestException('isPublished must be true or false');
      }

      result = result.filter(
        (event) => event.isPublished === (query.isPublished === 'true'),
      );
    } else {
      result = result.filter((event) => event.isPublished);
    }

    // Filter by category.
    if (query.category) {
      result = result.filter(
        (event) =>
          event.category.toLowerCase() === query.category!.toLowerCase(),
      );
    }

    // Filter by location.
    if (query.location) {
      result = result.filter((event) =>
        event.location.toLowerCase().includes(query.location!.toLowerCase()),
      );
    }

    // Sorting.
    const sortBy = query.sortBy ?? 'eventDate';
    const order = query.order ?? 'asc';

    if (!['eventDate', 'title'].includes(sortBy)) {
      throw new BadRequestException('Unsupported sort field');
    }

    if (!['asc', 'desc'].includes(order)) {
      throw new BadRequestException('Order must be asc or desc');
    }

    result.sort((a, b) => {
      const comparison =
        sortBy === 'title'
          ? a.title.localeCompare(b.title)
          : new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();

      return order === 'asc' ? comparison : -comparison;
    });

    // Pagination.
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

    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const items = result.slice((page - 1) * limit, page * limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  findUpcoming(): Event[] {
    const today = new Date();

    return events.filter((event) => new Date(event.eventDate) >= today);
  }
  findOne(id: string): Event {
    const event = events.find((item) => item.id === id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }
  remove(id: string): Event {
    const eventIndex = events.findIndex((item) => item.id === id);

    if (eventIndex === -1) {
      throw new NotFoundException('Event not found');
    }

    const deletedEvent = events[eventIndex];

    events.splice(eventIndex, 1);

    return deletedEvent;
  }
  update(id: string, dto: UpdateEventDto): Event {
    const event = this.findOne(id);

    Object.assign(event, dto);

    return event;
  }

  findSessions(eventId: string): EventSession[] {
    this.findOne(eventId);

    return sessions.filter((session) => session.eventId === eventId);
  }

  findSession(eventId: string, sessionId: string): EventSession {
    this.findOne(eventId);

    const session = sessions.find(
      (item) => item.id === sessionId && item.eventId === eventId,
    );

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }
}
