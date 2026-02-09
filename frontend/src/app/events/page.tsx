import { Event, EventsListResponse } from '@/types/event.types';
import EventCard from '@/components/dashboard/EventCard';
import EventGrid from '@/components/dashboard/EventGrid';
import { cookies } from 'next/headers';

const API_URL = (typeof window === 'undefined' && process.env.API_URL_INTERNAL)
    ? process.env.API_URL_INTERNAL
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

/**
 * Fetch public events server-side with no caching for fresh data
 * Falls back to /events endpoint and filters for PUBLISHED if /events/public is unavailable
 */

async function getPublicEvents(): Promise<Event[]> {
    console.log('[SSR] Fetching events from:', API_URL);

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    try {
        // Try the public endpoint first
        try {
            const response = await fetch(`${API_URL}/events/public`, {
                cache: 'no-store',
                headers,
            });

            console.log('[SSR] /events/public response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('[SSR] /events/public data:', Array.isArray(data) ? `${data.length} events` : data);
                // Handle both { data: Event[] } and Event[] formats
                const events = Array.isArray(data) ? data : (data.data || []);
                return events;
            }
        } catch (error) {
            console.log('[SSR] /events/public error:', error);
        }

        // Fallback: Try regular /events endpoint and filter for PUBLISHED
        try {
            const response = await fetch(`${API_URL}/events`, {
                cache: 'no-store',
                headers,
            });

            console.log('[SSR] /events response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('[SSR] /events data:', Array.isArray(data) ? `${data.length} events` : data);
                // Handle both { data: Event[] } and Event[] formats
                const events = Array.isArray(data) ? data : (data.data || []);

                // If we are using the fallback endpoint, we might not have backend filtering for bookings.
                // But typically /events is admin-facing or general listing.
                // Ideally /events/public should work. 
                return events.filter((event: Event) => event.status === 'PUBLISHED');
            }
        } catch (error) {
            console.log('[SSR] /events error:', error);
        }

        return [];
    } catch (error) {
        console.log('[SSR] Catch-all error:', error);
        return [];
    }
}

export default async function PublicEventsPage() {
    const events = await getPublicEvents();

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section - Exhibition Style */}
            <header className="relative overflow-hidden">
                {/* Background decorative element */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-coral/5 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
                    <div className="max-w-2xl">
                        {/* Eyebrow */}
                        <p className="text-coral text-sm font-medium uppercase tracking-widest mb-4">
                            Discover & Experience
                        </p>

                        {/* Main Title - Massive Serif with negative tracking */}
                        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-navy tracking-tight leading-[0.95] mb-6">
                            Upcoming
                            <br />
                            <span className="text-coral">Events</span>
                        </h1>

                        {/* Subtitle with offset */}
                        <p className="text-slate text-lg md:text-xl leading-relaxed max-w-lg pl-1">
                            Explore our curated collection of experiences.
                            Each event is crafted to inspire, connect, and create lasting memories.
                        </p>

                        {/* Decorative asymmetric line */}
                        <div className="mt-8 flex items-center gap-4">
                            <div className="h-px w-24 bg-gradient-to-r from-coral to-coral/50" />
                            <span className="text-xs text-slate uppercase tracking-wider">
                                {events.length} {events.length === 1 ? 'Event' : 'Events'} Available
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Asymmetric Exhibition Layout */}
            <main className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
                {events.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                        {/* Left Column - Contextual Info (30%) */}
                        <aside className="lg:w-[30%] lg:sticky lg:top-8 lg:self-start">
                            <div className="space-y-8">
                                {/* Filter hint */}
                                <div className="p-6 bg-white/50 backdrop-blur-sm rounded-lg border border-slate/10">
                                    <h3 className="font-serif text-lg font-semibold text-navy mb-3">
                                        The Exhibition
                                    </h3>
                                    <p className="text-sm text-slate leading-relaxed">
                                        Our events are more than gatherings—they are curated experiences
                                        designed to bring together curious minds and passionate souls.
                                    </p>
                                </div>

                                {/* Quick stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white rounded-lg shadow-sm">
                                        <p className="text-2xl font-serif font-bold text-navy">
                                            {events.length}
                                        </p>
                                        <p className="text-xs text-slate uppercase tracking-wider">
                                            Live Events
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white rounded-lg shadow-sm">
                                        <p className="text-2xl font-serif font-bold text-coral">
                                            {events.reduce((acc, e) => acc + e.capacity, 0)}
                                        </p>
                                        <p className="text-xs text-slate uppercase tracking-wider">
                                            Total Seats
                                        </p>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="hidden lg:block">
                                    <p className="text-xs text-slate mb-3">
                                        Can&apos;t find what you&apos;re looking for?
                                    </p>
                                    <a
                                        href="/contact"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-coral hover:text-coral/80 transition-colors"
                                    >
                                        <span>Contact us</span>
                                        <span className="text-coral/50">→</span>
                                    </a>
                                </div>
                            </div>
                        </aside>

                        {/* Right Column - Event Grid (70%) */}
                        <section className="lg:w-[70%]">
                            <EventGrid>
                                {events.map((event, index) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        index={index}
                                        isPublicView={true}
                                    />
                                ))}
                            </EventGrid>
                        </section>
                    </div>
                ) : (
                    /* Empty State - Poetic Minimal Design */
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <div className="max-w-md">
                            {/* Decorative element */}
                            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-coral/10 to-coral/5 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral/20 to-coral/10 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-coral/40" />
                                </div>
                            </div>

                            <h2 className="font-serif text-3xl font-bold text-navy mb-4">
                                The Stage Awaits
                            </h2>
                            <p className="text-slate leading-relaxed mb-8">
                                No events are currently scheduled, but great things are on the horizon.
                                Check back soon for upcoming experiences.
                            </p>

                            {/* Decorative line */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-px w-12 bg-slate/20" />
                                <span className="text-xs text-slate/50 uppercase tracking-widest">
                                    Coming Soon
                                </span>
                                <div className="h-px w-12 bg-slate/20" />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer accent */}
            <footer className="border-t border-slate/10 py-8">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                    <p className="text-xs text-slate">
                        All events are subject to availability. Book early to secure your spot.
                    </p>
                </div>
            </footer>
        </div>
    );
}
