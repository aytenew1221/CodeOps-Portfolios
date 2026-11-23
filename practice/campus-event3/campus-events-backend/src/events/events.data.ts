import { Event, EventSession } from './event.interface';

export const events: Event[] = [
    {
        id: 'evt-101',
        title: 'Technology Conference',
        description: 'Campus technology conference.',
        location: 'Main Hall',
        eventDate: '2026-12-04T09:00:00.000Z',
        category: 'technology',
        isPublished: true
    },
    {
        id: 'evt-102',
        title: 'Business Workshop',
        description: 'Entrepreneurship workshop.',
        location: 'Business Block',
        eventDate: '2026-12-10T10:00:00.000Z',
        category: 'business',
        isPublished: true
    },
    {
        id: 'evt-103',
        title: 'Sports Festival',
        description: 'Annual campus sports festival.',
        location: 'Sports Ground',
        eventDate: '2026-12-15T08:00:00.000Z',
        category: 'sports',
        isPublished: true
    },
    {
        id: 'evt-104',
        title: 'Science Exhibition',
        description: 'Student science projects.',
        location: 'Science Block',
        eventDate: '2026-12-20T09:00:00.000Z',
        category: 'science',
        isPublished: false
    },
    {
        id: 'evt-105',
        title: 'Cultural Day',
        description: 'Celebrating campus cultures.',
        location: 'Main Hall',
        eventDate: '2026-12-25T09:00:00.000Z',
        category: 'culture',
        isPublished: true
    }
];

export const sessions: EventSession[] = [
    {
        id: 'ses-201',
        eventId: 'evt-101',
        title: 'Opening Keynote',
        startsAt: '2026-12-04T09:00:00.000Z',
        endsAt: '2026-12-04T10:00:00.000Z',
        room: 'Hall A'
    },
    {
        id: 'ses-202',
        eventId: 'evt-101',
        title: 'Web Development',
        startsAt: '2026-12-04T10:30:00.000Z',
        endsAt: '2026-12-04T12:00:00.000Z',
        room: 'Lab 1'
    },
    {
        id: 'ses-203',
        eventId: 'evt-102',
        title: 'Business Planning',
        startsAt: '2026-12-10T10:00:00.000Z',
        endsAt: '2026-12-10T11:30:00.000Z',
        room: 'Room 2'
    },
    {
        id: 'ses-204',
        eventId: 'evt-102',
        title: 'Marketing Strategy',
        startsAt: '2026-12-10T13:00:00.000Z',
        endsAt: '2026-12-10T14:00:00.000Z',
        room: 'Room 3'
    }
];
