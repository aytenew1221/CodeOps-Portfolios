import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

import request = require('supertest');

import { AppModule } from './../src/app.module';

describe('Campus Events API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Match the application configuration in main.ts
    app.setGlobalPrefix('api');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 1. Test the application welcome endpoint
  it('GET /api - should return Hello World!', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });

  // 2. Test event collection
  it('GET /api/events - should return published events', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/events')
      .expect(200);

    expect(response.body.items).toBeInstanceOf(Array);

    expect(response.body.items.length).toBeGreaterThan(0);

    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'evt-101',
          title: 'Technology Conference',
          isPublished: true,
        }),
      ]),
    );

    // Unpublished events should not appear by default.
    expect(response.body.items).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'evt-104',
        }),
      ]),
    );
  });

  // 3. Test individual event details
  it('GET /api/events/evt-101 - should return event details', () => {
    return request(app.getHttpServer())
      .get('/api/events/evt-101')
      .expect(200)
      .expect((response) => {
        expect(response.body.id).toBe('evt-101');
        expect(response.body.title).toBe('Technology Conference');
        expect(response.body.location).toBe('Main Hall');
      });
  });

  // 4. Test event sessions collection
  it('GET /api/events/evt-101/sessions - should return event sessions', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/events/evt-101/sessions')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'ses-201',
          eventId: 'evt-101',
          title: 'Opening Keynote',
        }),
        expect.objectContaining({
          id: 'ses-202',
          eventId: 'evt-101',
          title: 'Web Development',
        }),
      ]),
    );
  });

  // 5. Test individual session details
  it('GET /api/events/evt-101/sessions/ses-201 - should return one session', () => {
    return request(app.getHttpServer())
      .get('/api/events/evt-101/sessions/ses-201')
      .expect(200)
      .expect((response) => {
        expect(response.body.id).toBe('ses-201');
        expect(response.body.eventId).toBe('evt-101');
        expect(response.body.title).toBe('Opening Keynote');
        expect(response.body.room).toBe('Hall A');
      });
  });

  // 6. Test nonexistent event
  it('GET /api/events/evt-999 - should return 404', () => {
    return request(app.getHttpServer())
      .get('/api/events/evt-999')
      .expect(404)
      .expect((response) => {
        expect(response.body.message).toBe('Event not found');
      });
  });

  // 7. Test nonexistent session
  it('GET /api/events/evt-101/sessions/ses-999 - should return 404', () => {
    return request(app.getHttpServer())
      .get('/api/events/evt-101/sessions/ses-999')
      .expect(404)
      .expect((response) => {
        expect(response.body.message).toBe('Session not found');
      });
  });

  // 8. Test session ownership
  it('should not return a session belonging to another event', () => {
    return request(app.getHttpServer())
      .get('/api/events/evt-102/sessions/ses-201')
      .expect(404)
      .expect((response) => {
        expect(response.body.message).toBe('Session not found');
      });
  });
});
