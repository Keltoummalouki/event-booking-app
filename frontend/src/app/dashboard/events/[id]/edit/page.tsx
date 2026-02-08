'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, EventFormData, EventStatus } from '@/lib/validations/event.validation';
import { Event } from '@/types/event.types';
import { eventService } from '@/services/event.service';
import { useAuthGuard } from '@/lib/auth-guard';
import CustomDatePicker from '@/components/admin/CustomDatePicker';
import StatusToggle from '@/components/admin/StatusToggle';
import EventPreview from '@/components/admin/EventPreview';
import AsymmetricToast, { ToastType } from '@/components/admin/AsymmetricToast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function EditEventPage() {
    useAuthGuard();

    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false,
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema) as any,
        defaultValues: {
            status: 'DRAFT' as EventStatus,
            capacity: 50,
        },
    });


    const formData = watch();

    // Fetch event data on mount
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/events/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Event not found');
                }

                const data: Event = await response.json();
                setEvent(data);

                // Pre-populate form with event data
                reset({
                    title: data.title,
                    description: data.description,
                    date: new Date(data.date).toISOString().slice(0, 16),
                    location: data.location,
                    capacity: data.capacity,
                    status: data.status as EventStatus,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load event');
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId, reset]);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type, isVisible: true });
    };

    const onSubmit = async (data: EventFormData) => {
        setIsSubmitting(true);
        try {
            await eventService.updateEvent(eventId, data);
            showToast('Event updated successfully!', 'success');
            setTimeout(() => {
                router.push(`/dashboard/events/${eventId}`);
            }, 1500);
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to update event', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream dark:bg-navy-deep flex items-center justify-center">
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
            <div className="min-h-screen bg-cream dark:bg-navy-deep flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                        Event Not Found
                    </h1>
                    <p className="text-foreground-muted mb-6">{error}</p>
                    <Link href="/dashboard/events">
                        <button className="px-6 py-3 bg-coral text-white rounded-lg font-medium">
                            Back to Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <div className="min-h-screen bg-cream dark:bg-navy-deep">
                <main className="px-6 lg:px-8 py-12">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <Link
                            href={`/dashboard/events/${eventId}`}
                            className="inline-flex items-center gap-2 text-slate hover:text-coral transition-colors mb-4"
                        >
                            <ArrowLeft size={18} />
                            <span className="text-sm font-medium">Back to Event</span>
                        </Link>
                        <h1 className="text-4xl font-bold text-navy dark:text-cream font-serif mb-2">
                            Edit Event
                        </h1>
                        <p className="text-slate">
                            Update the details for "{event.title}"
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Form Section - 60% */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="lg:col-span-3 space-y-6"
                        >
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Title */}
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="block text-sm font-medium text-navy dark:text-cream">
                                        Event Title <span className="text-coral">*</span>
                                    </label>
                                    <input
                                        {...register('title')}
                                        type="text"
                                        placeholder="Enter event title"
                                        className={`
                                            w-full px-4 py-3 rounded-lg border-2 
                                            bg-white dark:bg-navy/50
                                            text-navy dark:text-cream
                                            placeholder:text-slate/50
                                            transition-all duration-300
                                            focus:outline-none focus:border-coral
                                            ${errors.title ? 'border-error' : 'border-slate/30'}
                                        `}
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-error">{errors.title.message}</p>
                                    )}
                                </motion.div>

                                {/* Description */}
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="block text-sm font-medium text-navy dark:text-cream">
                                        Description <span className="text-coral">*</span>
                                    </label>
                                    <textarea
                                        {...register('description')}
                                        rows={5}
                                        placeholder="Describe your event in detail"
                                        className={`
                                            w-full px-4 py-3 rounded-lg border-2 
                                            bg-white dark:bg-navy/50
                                            text-navy dark:text-cream
                                            placeholder:text-slate/50
                                            transition-all duration-300
                                            focus:outline-none focus:border-coral
                                            resize-none
                                            ${errors.description ? 'border-error' : 'border-slate/30'}
                                        `}
                                    />
                                    {errors.description && (
                                        <p className="text-xs text-error">{errors.description.message}</p>
                                    )}
                                </motion.div>

                                {/* Date Picker */}
                                <motion.div variants={itemVariants}>
                                    <CustomDatePicker
                                        value={formData.date || ''}
                                        onChange={(date) => setValue('date', date, { shouldValidate: true })}
                                        error={errors.date?.message}
                                        disabled={isSubmitting}
                                    />
                                </motion.div>

                                {/* Location */}
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="block text-sm font-medium text-navy dark:text-cream">
                                        Location <span className="text-coral">*</span>
                                    </label>
                                    <input
                                        {...register('location')}
                                        type="text"
                                        placeholder="Event venue or address"
                                        className={`
                                            w-full px-4 py-3 rounded-lg border-2 
                                            bg-white dark:bg-navy/50
                                            text-navy dark:text-cream
                                            placeholder:text-slate/50
                                            transition-all duration-300
                                            focus:outline-none focus:border-coral
                                            ${errors.location ? 'border-error' : 'border-slate/30'}
                                        `}
                                    />
                                    {errors.location && (
                                        <p className="text-xs text-error">{errors.location.message}</p>
                                    )}
                                </motion.div>

                                {/* Capacity */}
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="block text-sm font-medium text-navy dark:text-cream">
                                        Capacity <span className="text-coral">*</span>
                                    </label>
                                    <input
                                        {...register('capacity', { valueAsNumber: true })}
                                        type="number"
                                        min="1"
                                        placeholder="Maximum number of participants"
                                        className={`
                                            w-full px-4 py-3 rounded-lg border-2 
                                            bg-white dark:bg-navy/50
                                            text-navy dark:text-cream
                                            placeholder:text-slate/50
                                            transition-all duration-300
                                            focus:outline-none focus:border-coral
                                            ${errors.capacity ? 'border-error' : 'border-slate/30'}
                                        `}
                                    />
                                    {errors.capacity && (
                                        <p className="text-xs text-error">{errors.capacity.message}</p>
                                    )}
                                </motion.div>

                                {/* Status Toggle */}
                                <motion.div variants={itemVariants}>
                                    <StatusToggle
                                        value={formData.status || 'DRAFT'}
                                        onChange={(status) => setValue('status', status)}
                                        disabled={isSubmitting}
                                    />
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div variants={itemVariants} className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`
                                            w-full py-4 rounded-lg font-semibold text-white
                                            flex items-center justify-center gap-2
                                            transition-all duration-300
                                            ${isSubmitting
                                                ? 'bg-slate/50 cursor-not-allowed'
                                                : 'bg-coral hover:bg-coral-hover shadow-lg hover:shadow-xl hover:shadow-coral/30'
                                            }
                                            btn-asymmetric
                                        `}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            </form>
                        </motion.div>

                        {/* Preview Section - 40% */}
                        <div className="lg:col-span-2">
                            <EventPreview formData={formData} />
                        </div>
                    </div>
                </main>
            </div>

            {/* Toast Notification */}
            <AsymmetricToast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />
        </>
    );
}

