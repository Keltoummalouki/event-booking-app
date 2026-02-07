'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { EventFormData } from '@/lib/validations/event.validation';
import { EventStatus } from '@/types/event.types';

interface EventPreviewProps {
    formData: Partial<EventFormData>;
}

export default function EventPreview({ formData }: EventPreviewProps) {
    const { title, description, date, location, capacity, status } = formData;

    const formatDate = (dateStr?: string): string => {
        if (!dateStr) return 'Not set';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateStr?: string): string => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="sticky top-6 space-y-4">
            <h3 className="text-lg font-semibold text-navy dark:text-cream">
                Live Preview
            </h3>
            <p className="text-xs text-slate">
                This is how your event will appear in the catalog
            </p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-lg border-2 border-slate/20 bg-white dark:bg-navy/50 shadow-xl"
            >
                {/* Status Badge */}
                {status && (
                    <div className="absolute top-4 right-4 z-10">
                        <span
                            className={`
                                px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                                ${status === 'PUBLISHED'
                                    ? 'bg-success text-white'
                                    : 'bg-slate/20 text-slate'
                                }
                            `}
                        >
                            {status}
                        </span>
                    </div>
                )}

                {/* Header Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-coral/20 via-coral/10 to-transparent flex items-center justify-center">
                    <Calendar size={48} className="text-coral/30" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-navy dark:text-cream font-serif">
                        {title || 'Event Title'}
                    </h2>

                    <p className="text-sm text-slate line-clamp-3">
                        {description || 'Event description will appear here...'}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-slate/20">
                        {/* Date */}
                        <div className="flex items-start gap-3">
                            <Calendar size={18} className="text-coral mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-navy dark:text-cream">
                                    {formatDate(date)}
                                </p>
                                {date && (
                                    <p className="text-xs text-slate">{formatTime(date)}</p>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-coral mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-navy dark:text-cream">
                                {location || 'Location not set'}
                            </p>
                        </div>

                        {/* Capacity */}
                        <div className="flex items-start gap-3">
                            <Users size={18} className="text-coral mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-navy dark:text-cream">
                                {capacity ? `${capacity} participants` : 'Capacity not set'}
                            </p>
                        </div>
                    </div>

                    {/* CTA Button Preview */}
                    <button
                        type="button"
                        disabled
                        className="w-full mt-6 py-3 rounded-lg bg-coral text-white font-semibold opacity-50 cursor-not-allowed"
                    >
                        Register Now
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
