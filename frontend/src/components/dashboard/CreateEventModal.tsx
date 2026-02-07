'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FloatingInput from '@/components/auth/FloatingInput';
import { CreateEventDto, EventStatus } from '@/types/event.types';

const createEventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().min(1, 'Date is required'),
    location: z.string().min(3, 'Location must be at least 3 characters'),
    capacity: z.number().min(1, 'Capacity must be at least 1'),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELED']),
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateEventDto) => Promise<void>;
}

export default function CreateEventModal({ isOpen, onClose, onSubmit }: CreateEventModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<CreateEventFormData>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            status: 'DRAFT',
        },
    });

    const handleFormSubmit = async (data: CreateEventFormData) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
            reset();
            onClose();
        } catch (error) {
            console.error('Error creating event:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-cream w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden clip-corner-tr">
                            {/* Header */}
                            <div className="relative bg-gradient-coral p-6 text-white">
                                <h2 className="font-serif text-3xl font-semibold tracking-tight-custom">
                                    Create New Event
                                </h2>
                                <p className="text-white/80 text-sm mt-1">Fill in the details below</p>

                                <button
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors disabled:opacity-50"
                                    aria-label="Close modal"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 space-y-6">
                                {/* Title */}
                                <div className="relative">
                                    <div className="absolute left-0 top-4 text-coral">
                                        <FileText size={20} />
                                    </div>
                                    <div className="pl-8">
                                        <FloatingInput
                                            {...register('title')}
                                            label="Event Title"
                                            error={errors.title?.message}
                                            value={watch('title')}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-navy mb-2">Description</label>
                                    <textarea
                                        {...register('description')}
                                        rows={4}
                                        className="w-full p-4 border border-slate/20 rounded-lg focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none transition-all resize-none"
                                        placeholder="Describe your event..."
                                    />
                                    {errors.description && (
                                        <p className="text-xs text-error mt-1">{errors.description.message}</p>
                                    )}
                                </div>

                                {/* Date and Location - Grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <div className="absolute left-0 top-4 text-coral">
                                            <Calendar size={20} />
                                        </div>
                                        <div className="pl-8">
                                            <FloatingInput
                                                {...register('date')}
                                                type="datetime-local"
                                                label="Event Date"
                                                error={errors.date?.message}
                                                value={watch('date')}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-0 top-4 text-coral">
                                            <MapPin size={20} />
                                        </div>
                                        <div className="pl-8">
                                            <FloatingInput
                                                {...register('location')}
                                                label="Location"
                                                error={errors.location?.message}
                                                value={watch('location')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Capacity and Status - Grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <div className="absolute left-0 top-4 text-coral">
                                            <Users size={20} />
                                        </div>
                                        <div className="pl-8">
                                            <FloatingInput
                                                {...register('capacity', { valueAsNumber: true })}
                                                type="number"
                                                label="Capacity"
                                                error={errors.capacity?.message}
                                                value={watch('capacity')?.toString() || ''}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-navy mb-2">Status</label>
                                        <select
                                            {...register('status')}
                                            className="w-full p-4 border border-slate/20 rounded-lg focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none transition-all bg-white"
                                        >
                                            <option value="DRAFT">Draft</option>
                                            <option value="PUBLISHED">Published</option>
                                            <option value="CANCELED">Canceled</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 border border-slate/20 text-navy rounded-lg hover:bg-slate/5 transition-colors disabled:opacity-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 bg-gradient-coral text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium btn-asymmetric"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Event'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
