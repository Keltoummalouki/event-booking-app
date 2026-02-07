'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, MoreVertical } from 'lucide-react';
import { Event, EventStatus } from '@/types/event.types';
import Link from 'next/link';

interface EventCardProps {
    event: Event;
    index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getDaysUntil = (dateStr: string): number => {
        const eventDate = new Date(dateStr);
        const today = new Date();
        const diffTime = eventDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysUntil = getDaysUntil(event.date);
    const isUpcoming = daysUntil >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
        >
            <Link href={`/dashboard/events/${event.id}`}>
                <div className="relative overflow-hidden rounded-lg border-2 border-slate/20 bg-white dark:bg-navy/50 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:border-coral/50">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-coral/0 to-coral/0 group-hover:from-coral/5 group-hover:to-coral/10 transition-all duration-300 pointer-events-none" />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                        <span
                            className={`
                                px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                                ${event.status === 'PUBLISHED'
                                    ? 'bg-success text-white'
                                    : event.status === 'DRAFT'
                                        ? 'bg-slate/20 text-slate'
                                        : 'bg-error text-white'
                                }
                            `}
                        >
                            {event.status}
                        </span>
                    </div>

                    {/* Header */}
                    <div className="h-32 bg-gradient-to-br from-coral/20 via-coral/10 to-transparent flex items-center justify-center relative">
                        <Calendar size={40} className="text-coral/30" />

                        {/* Days until badge */}
                        {isUpcoming && daysUntil <= 30 && (
                            <div className="absolute bottom-3 left-3 bg-navy/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                                {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="relative p-5 space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-navy dark:text-cream font-serif line-clamp-2 group-hover:text-coral transition-colors">
                                {event.title}
                            </h3>
                            <p className="text-sm text-slate mt-2 line-clamp-2">
                                {event.description}
                            </p>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-slate/20">
                            {/* Date */}
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar size={16} className="text-coral" />
                                <span className="text-navy dark:text-cream">{formatDate(event.date)}</span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin size={16} className="text-coral" />
                                <span className="text-navy dark:text-cream line-clamp-1">{event.location}</span>
                            </div>

                            {/* Capacity */}
                            <div className="flex items-center gap-2 text-sm">
                                <Users size={16} className="text-coral" />
                                <span className="text-navy dark:text-cream">{event.capacity} participants</span>
                            </div>
                        </div>

                        {/* Stats on hover */}
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            whileHover={{ opacity: 1, height: 'auto' }}
                            className="pt-3 border-t border-slate/20 overflow-hidden"
                        >
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate">Registrations</span>
                                <span className="font-semibold text-navy dark:text-cream">0 / {event.capacity}</span>
                            </div>
                            <div className="mt-2 h-2 bg-slate/20 rounded-full overflow-hidden">
                                <div className="h-full bg-coral rounded-full" style={{ width: '0%' }} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Link>

            {/* Actions button */}
            <button
                className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/80 dark:bg-navy/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-navy"
                onClick={(e) => {
                    e.preventDefault();
                    // TODO: Add actions menu
                }}
            >
                <MoreVertical size={16} className="text-navy dark:text-cream" />
            </button>
        </motion.div>
    );
}
