import { api } from '@/lib/api-client';
import { CreateEventDto, Event } from '@/types/event.types';

export interface Booking {
    id: string;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
    participant: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    createdAt: string;
}


export const eventService = {
    /**
     * Create a new event (Admin only)
     * POST /events
     */
    async createEvent(eventData: CreateEventDto): Promise<Event> {
        // Backend returns the created event directly
        const response = await api.post<Event>('/events', eventData);
        return response;
    },

    /**
     * Get all events
     * GET /events
     */
    async getAllEvents(): Promise<Event[]> {
        console.log('[eventService] Fetching all events...');
        // Backend returns Event[] directly, NOT { data: Event[] }
        const response = await api.get<Event[]>('/events');
        console.log('[eventService] Received:', response?.length ?? 0, 'events');
        return response || [];
    },

    /**
     * Get event by ID
     * GET /events/:id
     */
    async getEventById(id: string): Promise<Event> {
        const response = await api.get<Event>(`/events/${id}`);
        return response;
    },

    /**
     * Update event (Admin only)
     * PATCH /events/:id
     */
    async updateEvent(id: string, eventData: Partial<CreateEventDto>): Promise<Event> {
        const response = await api.patch<Event>(`/events/${id}`, eventData);
        return response;
    },

    /**
     * Delete event (Admin only)
     * DELETE /events/:id
     */
    async deleteEvent(id: string): Promise<void> {
        await api.delete(`/events/${id}`);
    },

    /**
     * Publish event (Admin only) - Change status from DRAFT to PUBLISHED
     * PATCH /events/:id/publish
     */
    async publishEvent(id: string): Promise<Event> {
        const response = await api.patch<Event>(`/events/${id}/publish`);
        return response;
    },

    /**
     * Create a booking for an event
     * POST /bookings
     */
    async createBooking(eventId: string): Promise<unknown> {
        return await api.post('/bookings', { eventId });
    },

    /**
     * Get bookings for an event (Admin only)
     * GET /bookings/event/:eventId
     */
    async getBookingsByEvent(eventId: string): Promise<Booking[]> {
        return await api.get<Booking[]>(`/bookings/event/${eventId}`);
    },

    /**
     * Update booking status (Admin only)
     * PATCH /bookings/:id/status
     */
    async updateBookingStatus(bookingId: string, status: 'CONFIRMED' | 'REJECTED'): Promise<Booking> {
        return await api.patch<Booking>(`/bookings/${bookingId}/status`, { status });
    },
};
