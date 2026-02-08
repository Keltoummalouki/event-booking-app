import { api } from '@/lib/api-client';
import { CreateEventDto, Event, EventResponse, EventsListResponse } from '@/types/event.types';


export const eventService = {
    /**
     * Create a new event (Admin only)
     * POST /events
     */
    async createEvent(eventData: CreateEventDto): Promise<Event> {
        const response = await api.post<EventResponse>('/events', eventData);
        return response.data;
    },

    /**
     * Get all events
     * GET /events
     */
    async getAllEvents(): Promise<Event[]> {
        const response = await api.get<EventsListResponse>('/events');
        return response.data;
    },

    /**
     * Get event by ID
     * GET /events/:id
     */
    async getEventById(id: string): Promise<Event> {
        const response = await api.get<EventResponse>(`/events/${id}`);
        return response.data;
    },

    /**
     * Update event (Admin only)
     * PATCH /events/:id
     */
    async updateEvent(id: string, eventData: Partial<CreateEventDto>): Promise<Event> {
        const response = await api.patch<EventResponse>(`/events/${id}`, eventData);
        return response.data;
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
        const response = await api.patch<EventResponse>(`/events/${id}/publish`);
        return response.data;
    },
};

