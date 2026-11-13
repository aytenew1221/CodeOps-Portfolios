export interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    eventDate: string;
    category: string;
    isPublished: boolean;
}

export interface EventSession {
    id: string;
    eventId: string;
    title: string;
    startsAt: string;
    endsAt: string;
    room: string;
}
