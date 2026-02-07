'use client';

import { useState, useEffect, useCallback } from 'react';
import { eventService } from '@/services/event.service';
import { Event } from '@/types/event.types';
import { ApiClientError } from '@/lib/api-client';

interface UseEventsReturn {
    events: Event[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing events
 * Includes automatic error handling, loading states, and revalidation
 */
export function useEvents(): UseEventsReturn {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await eventService.getAllEvents();
            setEvents(data);
        } catch (err) {
            if (err instanceof ApiClientError) {
                // Don't set error if it's a 401 (user will be redirected)
                if (err.statusCode !== 401) {
                    setError(err.message);
                }
            } else {
                setError(err instanceof Error ? err.message : 'Failed to load events');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return {
        events,
        isLoading,
        error,
        refetch: fetchEvents,
    };
}
