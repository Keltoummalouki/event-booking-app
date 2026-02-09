'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    Clock,
    User,
    AlertCircle,
    Ticket,
    CheckCircle
} from 'lucide-react';
import { Event } from '@/types/event.types';
import { eventService } from '@/services/event.service';
import { getCurrentUser } from '@/services/auth.service';
import StatusBadge from '@/components/ui/StatusBadge';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function PublicEventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                // Fetch from public endpoint
                const response = await fetch(`${API_URL}/events/${eventId}`, {
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error('Event not found');
                }

                const data = await response.json();
                setEvent(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load event');
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    const handleBook = async () => {
        if (!event || isBooking) return;

        // Check if user is logged in
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token) {
            // Redirect to login with return URL
            router.push(`/login?redirect=/events/${eventId}`);
            return;
        }

        const user = getCurrentUser();
        if (user?.role === 'ADMIN') {
            Swal.fire({
                title: 'Access Denied',
                text: "Administrators cannot book events. Please sign in as a Participant.",
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f97316',
                background: '#1e293b',
                color: '#fff'
            });
            return;
        }

        setIsBooking(true);
        try {
            await eventService.createBooking(event.id);
            setBookingSuccess(true);
        } catch (err) {
            console.error('Failed to book:', err);
            const message = err instanceof Error ? err.message : 'Failed to book. Please try again.';

            Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f97316',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setIsBooking(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            year: date.getFullYear(),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            full: date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
        };
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream dark:bg-navy-dark flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full"
                />
            </div>
        );
    }

    // Error State
    if (error || !event) {
        return (
            <div className="min-h-screen bg-cream dark:bg-navy-dark flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-error" />
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                        Event Not Found
                    </h1>
                    <p className="text-foreground-muted mb-6">
                        {error || "The event you're looking for doesn't exist or has been removed."}
                    </p>
                    <Link href="/events">
                        <button className="px-6 py-3 bg-coral text-white rounded-lg btn-asymmetric font-medium">
                            Browse All Events
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const dateInfo = formatDate(event.date);

    return (
        <div className="min-h-screen bg-cream dark:bg-navy-dark">
            {/* Navigation */}
            <header className="sticky top-20 z-20 glass border-b border-slate/10 dark:border-white/5 transition-all duration-300">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/events"
                        className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">All Events</span>
                    </Link>

                    <StatusBadge status={event.status} />
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                        >
                            {/* Date Badge */}
                            <div className="inline-flex items-center gap-4 mb-6">
                                <div className="px-4 py-2 rounded-lg bg-coral/10 text-coral font-semibold">
                                    <span className="text-2xl font-serif">{dateInfo.day}</span>
                                    <span className="ml-2 uppercase text-sm">{dateInfo.month}</span>
                                </div>
                                <span className="text-foreground-muted">{dateInfo.time}</span>
                            </div>

                            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground tracking-tight-custom mb-4">
                                {event.title}
                            </h1>

                            <p className="text-foreground-muted text-lg leading-relaxed">
                                {event.description}
                            </p>
                        </motion.div>

                        {/* Event Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid sm:grid-cols-2 gap-6"
                        >
                            {/* Location Card */}
                            <div className="p-6 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-coral/10 flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-coral" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground-muted mb-1">Location</p>
                                        <p className="font-semibold text-foreground">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Date Card */}
                            <div className="p-6 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-coral/10 flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-coral" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground-muted mb-1">Date</p>
                                        <p className="font-semibold text-foreground">{dateInfo.full}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Capacity Card */}
                            <div className="p-6 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-coral/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-coral" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground-muted mb-1">Capacity</p>
                                        <p className="font-semibold text-foreground">{event.capacity} seats</p>
                                    </div>
                                </div>
                            </div>

                            {/* Time Card */}
                            <div className="p-6 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-coral/10 flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-coral" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground-muted mb-1">Time</p>
                                        <p className="font-semibold text-foreground">{dateInfo.time}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Organizer Info */}
                        {event.organizer && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-6 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5"
                            >
                                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                                    Organized by
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral to-coral-hover flex items-center justify-center text-white font-semibold">
                                        {event.organizer.email?.[0]?.toUpperCase() || 'O'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">
                                            {event.organizer.firstName || 'Event Organizer'}
                                        </p>
                                        <p className="text-sm text-foreground-muted">
                                            {event.organizer.email}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Booking Sidebar */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5 sticky top-24"
                        >
                            {bookingSuccess ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-success" />
                                    </div>
                                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                                        You're In!
                                    </h3>
                                    <p className="text-foreground-muted mb-6">
                                        Your spot has been reserved. See you there!
                                    </p>
                                    <Link href="/dashboard">
                                        <button className="w-full px-4 py-3 text-coral ring-1 ring-coral/20 rounded-lg font-medium hover:bg-coral/5 transition-colors">
                                            View My Bookings
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                                        Reserve Your Spot
                                    </h3>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-foreground-muted">Available seats</span>
                                            <span className="font-semibold text-foreground">{event.capacity}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <p className="text-slate dark:text-gray-400 mb-6">
                                                You&apos;re about to book <span className="font-bold text-navy dark:text-white">{event.title}</span>.
                                            </p>    </div>
                                    </div>

                                    {event.status === 'PUBLISHED' ? (
                                        <button
                                            onClick={handleBook}
                                            disabled={isBooking}
                                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-coral text-white rounded-lg font-semibold btn-asymmetric hover:bg-coral-hover transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:shadow-coral/20"
                                        >
                                            {isBooking ? (
                                                <>
                                                    <motion.span
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    Booking...
                                                </>
                                            ) : (
                                                <>
                                                    <Ticket size={20} />
                                                    Book Now
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="p-4 rounded-lg bg-slate/5 dark:bg-white/5 text-center">
                                            <p className="text-foreground-muted text-sm">
                                                This event is not available for booking yet.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
