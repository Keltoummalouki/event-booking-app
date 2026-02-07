'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import EventCard from '@/components/admin/EventCard';
import Link from 'next/link';
import { useAuthGuard } from '@/lib/auth-guard';
import { useEvents } from '@/hooks/useEvents';

export default function EventsDashboard() {
    // Protect this route - redirect to login if not authenticated
    useAuthGuard();

    // Use custom hook for event fetching with integrated error handling
    const { events, isLoading, refetch } = useEvents();

    return (
        <div className="min-h-screen bg-cream dark:bg-navy-deep">
            <main className="px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-navy dark:text-cream font-serif mb-2">
                        Event Management
                    </h1>
                    <p className="text-slate">
                        Create, manage, and monitor your events
                    </p>
                </motion.div>

                {/* Premium Skeleton Loaders - Anti-Gravity Aesthetic */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative h-96 rounded-lg overflow-hidden glass-dark clip-corner-br"
                            >
                                {/* Gradient Header Skeleton */}
                                <div className="h-48 bg-gradient-to-br from-slate/20 to-slate/10 animate-shimmer" />

                                {/* Content Skeleton */}
                                <div className="p-6 space-y-4">
                                    {/* Title */}
                                    <div className="h-6 bg-slate/20 rounded w-3/4 animate-pulse" />

                                    {/* Description lines */}
                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate/15 rounded w-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                                        <div className="h-4 bg-slate/15 rounded w-5/6 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                    </div>

                                    {/* Meta info */}
                                    <div className="flex gap-4 pt-4">
                                        <div className="h-4 bg-slate/15 rounded w-24 animate-pulse" style={{ animationDelay: '0.3s' }} />
                                        <div className="h-4 bg-slate/15 rounded w-20 animate-pulse" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>

                                {/* Shimmer overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                            </motion.div>
                        ))}
                    </div>
                )}


                {/* Empty State */}
                {!isLoading && events && events.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="w-24 h-24 mx-auto rounded-full bg-coral/10 flex items-center justify-center">
                                <Plus size={48} className="text-coral" />
                            </div>
                            <h2 className="text-2xl font-bold text-navy dark:text-cream font-serif">
                                No events yet
                            </h2>
                            <p className="text-slate">
                                Get started by creating your first event
                            </p>
                            <Link href="/dashboard/events/new">
                                <button className="px-8 py-3 bg-coral hover:bg-coral-hover text-white font-semibold rounded-lg btn-asymmetric transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-coral/30">
                                    Create Your First Event
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* Events Grid - Asymmetric Layout */}
                {!isLoading && events && events.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
                        {events.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                        ))}
                    </div>
                )}
            </main>

            {/* Floating New Event Button */}
            {!isLoading && events && events.length > 0 && (
                <Link href="/dashboard/events/new">
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-8 right-8 w-16 h-16 bg-coral hover:bg-coral-hover text-white rounded-full shadow-2xl flex items-center justify-center z-40"
                        aria-label="Create new event"
                    >
                        <Plus size={28} />
                    </motion.button>
                </Link>
            )}
        </div>
    );
}
