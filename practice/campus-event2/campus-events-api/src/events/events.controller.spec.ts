
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from '@jest/globals';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;

  const eventsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllForStaff: jest.fn(),
    findOne: jest.fn(),
    findSessions: jest.fn(),
    findSession: jest.fn(),
    createSession: jest.fn(),
    updateSession: jest.fn(),
    removeSession: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: eventsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
