import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { readFile, writeFile } from 'node:fs/promises';
import { EventsService } from './events.service';

jest.mock('node:fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

const mockEvents = [
  {
    id: 'evt-101',
    title: 'Technology Conference',
    description: 'Campus technology conference.',
    location: 'Main Hall',
    eventDate: '2026-12-04T09:00:00.000Z',
    category: 'technology',
    isPublished: true,
  },
  {
    id: 'evt-104',
    title: 'Science Exhibition',
    description: 'Student science projects.',
    location: 'Science Block',
    eventDate: '2026-12-20T09:00:00.000Z',
    category: 'science',
    isPublished: false,
  },
];

const mockSessions = [
  {
    id: 'ses-201',
    eventId: 'evt-101',
    title: 'Opening Keynote',
    startsAt: '2026-12-04T09:00:00.000Z',
    endsAt: '2026-12-04T10:00:00.000Z',
    room: 'Hall A',
  },
];

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockedReadFile = readFile as unknown as {
      mockResolvedValue: (value: string) => void;
    };

    mockedReadFile.mockResolvedValue(
      JSON.stringify({
        events: mockEvents,
        sessions: mockSessions,
      }),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all events when no publication filter is provided', async () => {
    const result = await service.findAll({});

    expect(result.total).toBe(2);
    expect(result.items).toHaveLength(2);
  });

  it('should filter events by category', async () => {
    const result = await service.findAll({
      category: 'science',
    });

    expect(result.total).toBe(1);
    expect(result.items[0].title).toBe('Science Exhibition');
  });

  it('should return only unpublished events when requested', async () => {
    const result = await service.findAll({
      isPublished: 'false',
    });

    expect(result.total).toBe(1);
    expect(result.items[0].isPublished).toBe(false);
  });

  it('should return sessions belonging to an event', async () => {
    const result = await service.findSessions('evt-101');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Opening Keynote');
  });

  it('should save a newly created event to the JSON file', async () => {
    const mockedWriteFile = writeFile as unknown as {
      mockResolvedValue: (value: undefined) => void;
      mock: { calls: unknown[][] };
    };

    mockedWriteFile.mockResolvedValue(undefined);

    const result = await service.create({
      title: 'Test Event',
      description: 'Testing JSON storage',
      location: 'Main Hall',
      eventDate: '2026-12-30T09:00:00.000Z',
      category: 'technology',
      isPublished: true,
    });

    expect(result.title).toBe('Test Event');
    expect(writeFile).toHaveBeenCalledTimes(1);

    const savedContent = mockedWriteFile.mock.calls[0][1] as string;
    const savedData = JSON.parse(savedContent);

    expect(savedData.events).toHaveLength(3);
    expect(savedData.events[2].title).toBe('Test Event');
  });
});
