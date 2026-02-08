// Event Status as string literal union type (matching Zod schema)
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELED';

// Event interface matching backend entity
export interface Event {
    id: string;
    title: string;
    description: string;
    date: string; // ISO date string
    location: string;
    capacity: number;
    status: EventStatus;
    coverImageUrl?: string; // Optional cover image for card headers
    createdAt: string;
    organizer?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

// Create Event DTO (for POST requests)
export interface CreateEventDto {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    status: EventStatus;
}

// API Response types
export interface EventResponse {
    success: boolean;
    data: Event;
    message?: string;
}

export interface EventsListResponse {
    success: boolean;
    data: Event[];
    message?: string;
}

// Event statistics for dashboard cards
export interface EventStats {
    fillPercentage: number;
    daysUntilEvent: number;
    isUpcoming: boolean;
}
