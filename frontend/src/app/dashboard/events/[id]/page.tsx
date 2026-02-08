'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    Edit2,
    Trash2,
    Send,
    Clock,
    User,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { useAuthGuard } from '@/lib/auth-guard';
import { eventService } from '@/services/event.service';
import { Event } from '@/types/event.types';
import StatusBadge from '@/components/ui/StatusBadge';
import BookingList from '@/components/dashboard/BookingList';

export default function EventDetailPage() {
    useAuthGuard();

    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                const data = await eventService.getEventById(eventId);
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

    const handlePublish = async () => {
        if (!event || isPublishing) return;

        setIsPublishing(true);
        try {
            const updated = await eventService.publishEvent(event.id);
            setEvent(updated);
        } catch (err) {
            console.error('Failed to publish:', err);
        } finally {
            setIsPublishing(false);
        }
    };

    const handleDelete = async () => {
        if (!event || isDeleting) return;

        setIsDeleting(true);
        try {
            await eventService.deleteEvent(event.id);
            router.push('/dashboard/events');
        } catch (err) {
            console.error('Failed to delete:', err);
            setIsDeleting(false);
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
                    <button
                        onClick={() => router.push('/dashboard/events')}
                        className="px-6 py-3 bg-coral text-white rounded-lg btn-asymmetric font-medium"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const dateInfo = formatDate(event.date);

    return (
        <div className="min-h-screen bg-cream dark:bg-navy-dark">
            {/* Header */}
            <header className="sticky top-0 z-20 glass border-b border-slate/10 dark:border-white/5">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/dashboard/events')}
                        className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Events</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <StatusBadge status={event.status} variant="prominent" />
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground tracking-tight-custom mb-4">
                                {event.title}
                            </h1>
                            <p className="text-foreground-muted text-lg leading-relaxed">
                                {event.description}
                            </p>
                        </motion.div>

                        {/* Event Details Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid sm:grid-cols-2 gap-6"
                        >
                            {/* Date Card */}
                            <div className="p-6 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-coral/10 flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-coral" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground-muted mb-1">Date & Time</p>
                                        <p className="font-semibold text-foreground">{dateInfo.full}</p>
                                        <p className="text-sm text-coral font-medium">{dateInfo.time}</p>
                                    </div>
                                </div>
                            </div>

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

                            {/* Capacity Card */}
                            <div className="p-6 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-coral/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-coral" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground-muted mb-1">Capacity</p>
                                        <p className="font-semibold text-foreground">{event.capacity} seats</p>
                                        <p className="text-sm text-foreground-muted">Available</p>
                                    </div>
                                </div>
                            </div>

                            {/* Organizer Card */}
                            {event.organizer && (
                                <div className="p-6 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-coral/10 flex items-center justify-center">
                                            <User className="w-6 h-6 text-coral" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-foreground-muted mb-1">Organizer</p>
                                            <p className="font-semibold text-foreground">
                                                {event.organizer.firstName || event.organizer.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Bookings Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5"
                        >
                            <BookingList eventId={event.id} />
                        </motion.div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5 sticky top-24"
                        >
                            <h3 className="font-serif text-lg font-semibold text-foreground mb-6">
                                Actions
                            </h3>

                            <div className="space-y-3">
                                {/* Publish Button */}
                                {event.status === 'DRAFT' && (
                                    <button
                                        onClick={handlePublish}
                                        disabled={isPublishing}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-coral text-white rounded-lg font-medium btn-asymmetric hover:bg-coral-hover transition-colors disabled:opacity-50"
                                    >
                                        {isPublishing ? (
                                            <>
                                                <motion.span
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                />
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Publish Event
                                            </>
                                        )}
                                    </button>
                                )}

                                {/* Published Badge */}
                                {event.status === 'PUBLISHED' && (
                                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-success/10 text-success rounded-lg font-medium">
                                        <CheckCircle size={18} />
                                        Published
                                    </div>
                                )}

                                {/* Edit Button */}
                                <button
                                    onClick={() => router.push(`/dashboard/events/${event.id}/edit`)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-foreground ring-1 ring-slate/20 dark:ring-white/10 rounded-lg font-medium hover:bg-slate/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    <Edit2 size={18} />
                                    Edit Event
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-error ring-1 ring-error/20 rounded-lg font-medium hover:bg-error/5 transition-colors"
                                >
                                    <Trash2 size={18} />
                                    Delete Event
                                </button>
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-8 pt-6 border-t border-slate/10 dark:border-white/5">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-serif font-bold text-foreground">0</p>
                                        <p className="text-xs text-foreground-muted uppercase tracking-wider">Bookings</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-serif font-bold text-coral">{event.capacity}</p>
                                        <p className="text-xs text-foreground-muted uppercase tracking-wider">Capacity</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteConfirm(false)}
                            className="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="w-full max-w-md p-6 bg-white dark:bg-navy-dark rounded-lg shadow-2xl ring-1 ring-slate/10 dark:ring-white/10">
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
                                        <Trash2 className="w-6 h-6 text-error" />
                                    </div>
                                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                                        Delete Event?
                                    </h3>
                                    <p className="text-foreground-muted mb-6">
                                        This action cannot be undone. All bookings will also be deleted.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="flex-1 px-4 py-3 text-foreground ring-1 ring-slate/20 dark:ring-white/10 rounded-lg font-medium hover:bg-slate/5 dark:hover:bg-white/5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="flex-1 px-4 py-3 bg-error text-white rounded-lg font-medium hover:bg-error/90 transition-colors disabled:opacity-50"
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
