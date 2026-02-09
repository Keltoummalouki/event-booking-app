import { api } from '@/lib/api-client';
import { CreateEventDto, Event } from '@/types/event.types';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'REFUSED' | 'CANCELED';

export interface Booking {
    id: string;
    status: ReservationStatus;
    participant: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    event?: Event; // Needed for My Bookings
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
    async updateBookingStatus(bookingId: string, status: ReservationStatus): Promise<Booking> {
        return await api.patch<Booking>(`/bookings/${bookingId}/status`, { status });
    },

    /**
     * Get my bookings (Participant only)
     * GET /bookings/my-bookings
     */
    async getMyBookings(): Promise<Booking[]> {
        return await api.get<Booking[]>('/bookings/my-bookings');
    },

    /**
     * Cancel booking (Participant only)
     * PATCH /bookings/:id/cancel
     */
    async cancelBooking(bookingId: string): Promise<void> {
        await api.patch(`/bookings/${bookingId}/cancel`, {});
    },

    /**
     * Download ticket PDF
     * GET /bookings/:id/ticket
     */
    async downloadTicket(bookingId: string, eventTitle: string): Promise<void> {
        const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/bookings/${bookingId}/ticket`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Download failed:', response.status, response.statusText, errorText);
            throw new Error(`Failed to download ticket: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeTitle = eventTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
        a.download = `ticket-${safeTitle}-${bookingId.substring(0, 8)}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },
};
