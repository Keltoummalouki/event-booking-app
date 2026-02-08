'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Event } from '@/types/event.types';
import StatusBadge from '@/components/ui/StatusBadge';
import { api } from '@/lib/api-client';

interface EventCardProps {
    event: Event;
    index: number;
    isPublicView?: boolean;
}

export default function EventCard({ event, index, isPublicView = false }: EventCardProps) {
    const [isPublishing, setIsPublishing] = useState(false);
    const [isPublished, setIsPublished] = useState(false);

    const eventDate = new Date(event.date);
    const isUpcoming = eventDate > new Date();

    // Calculate days until event
    const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    // TODO: Integrate Booking API - Currently using mock data
    const fillPercentage = 65;

    // Publish event handler
    const handlePublish = async () => {
        if (isPublishing || isPublished) return;

        setIsPublishing(true);
        try {
            await api.patch(`/events/${event.id}/publish`);
            setIsPublished(true);
        } catch (error) {
            console.error('Failed to publish event:', error);
            setIsPublishing(false);
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="group relative"
        >
            {/* Card with layered shadows */}
            <div className="relative bg-white overflow-hidden shadow-layered hover:shadow-layered-hover transition-all duration-300 clip-corner-br">
                {/* Cover Image / Gradient Header with angled corner */}
                <div className="relative h-48 clip-angle-top overflow-hidden">
                    {event.coverImageUrl ? (
                        <img
                            src={event.coverImageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover saturate-hover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-navy/80 via-navy/60 to-coral/40 saturate-hover" />
                    )}

                    {/* Overlay gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />

                    {/* Event date overlay on image */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <span className="text-xs font-medium uppercase tracking-wider opacity-80">
                            {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <p className="font-serif text-3xl font-bold leading-none">
                            {eventDate.getDate()}
                        </p>
                    </div>
                </div>

                {/* Status badge - overlapping image edge (Admin only) */}
                {!isPublicView && (
                    <div className="absolute top-44 right-6 z-10">
                        <StatusBadge status={event.status} variant="prominent" />
                    </div>
                )}

                {/* Content container with asymmetric padding */}
                <div className="p-6 pt-8">
                    {/* Title - Serif font for typographic strength */}
                    <h3 className="font-serif text-xl font-semibold text-navy mb-2 tracking-tight-custom line-clamp-1">
                        {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-2">
                        {event.description}
                    </p>

                    {/* Event details - compact layout */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-slate">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-coral" />
                            <span className="truncate max-w-[120px]">{event.location}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-coral" />
                            <span>{event.capacity} seats</span>
                        </div>

                        {isUpcoming && daysUntil > 0 && (
                            <div className="flex items-center gap-1.5 text-coral font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{daysUntil}d left</span>
                            </div>
                        )}
                    </div>

                    {/* Filling rate progress bar */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-slate">Capacity</span>
                            <span className="text-coral font-medium">{fillPercentage}% filled</span>
                        </div>
                        <div className="h-1.5 progress-bar-base">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${fillPercentage}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                                className="h-full progress-bar-fill"
                            />
                        </div>
                    </div>

                    {/* Organizer info */}
                    {event.organizer && (
                        <div className="pt-3 border-t border-slate/10">
                            <p className="text-xs text-slate">
                                By <span className="font-medium text-navy">{event.organizer.firstName} {event.organizer.lastName}</span>
                            </p>
                        </div>
                    )}

                    {/* Asymmetric Publish Button - Admin Only */}
                    {!isPublicView && (
                        <AnimatePresence>
                            {event.status === 'DRAFT' && !isPublished && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute bottom-4 right-4 translate-x-1 translate-y-1"
                                >
                                    <button
                                        onClick={handlePublish}
                                        disabled={isPublishing}
                                        className={`
                                        relative px-4 py-2
                                        bg-transparent
                                        text-[10px] font-medium uppercase tracking-widest
                                        text-coral
                                        transition-all duration-300
                                        group/publish
                                        ${isPublishing ? 'opacity-50 cursor-wait' : 'hover:text-coral/80'}
                                    `}
                                    >
                                        {/* Animated bottom border */}
                                        <span
                                            className="absolute bottom-0 left-0 right-0 h-[1px] bg-coral/40 origin-left transition-transform duration-300 group-hover/publish:scale-x-100"
                                            style={{ transform: 'scaleX(0.3)' }}
                                        />
                                        <motion.span
                                            className="absolute bottom-0 left-0 right-0 h-[1px] bg-coral origin-left"
                                            initial={{ scaleX: 0 }}
                                            whileHover={{ scaleX: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />

                                        {/* Button text or loader */}
                                        {isPublishing ? (
                                            <span className="flex items-center gap-2">
                                                <motion.span
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    className="inline-block w-3 h-3 border border-coral border-t-transparent rounded-full"
                                                />
                                                <span>Publishing...</span>
                                            </span>
                                        ) : (
                                            'PUBLISH EVENT'
                                        )}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}

                    {/* Magnetic View Details Link - Public View Only */}
                    {isPublicView && (
                        <Link
                            href={`/events/${event.id}`}
                            className="group/link mt-4 flex items-center justify-between pt-4 border-t border-slate/10"
                        >
                            <span className="text-sm font-medium text-navy group-hover/link:text-coral transition-colors">
                                View Details
                            </span>
                            <motion.div
                                className="flex items-center gap-1 text-coral"
                                whileHover={{ x: 4 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            >
                                <ArrowRight size={16} />
                            </motion.div>
                        </Link>
                    )}
                </div>

                {/* Hover effect - subtle gradient overlay */}
                <div className="absolute inset-0 gradient-coral-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Asymmetric accent line on hover */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-coral to-coral/50 origin-left"
            />
        </motion.article>
    );
}
