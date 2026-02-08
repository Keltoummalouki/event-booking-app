'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, EventFormData } from '@/lib/validations/event.validation';
import { EventStatus } from '@/types/event.types';
import { useState } from 'react';
import CustomDatePicker from './CustomDatePicker';
import StatusToggle from './StatusToggle';
import EventPreview from './EventPreview';
import AsymmetricToast, { ToastType } from './AsymmetricToast';
import { eventService } from '@/services/event.service';
import { useRouter } from 'next/navigation';

export default function EventForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        formState: { errors },
    } = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            status: 'DRAFT',
            capacity: 50,
        },
    });

    const formData = watch();

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type, isVisible: true });
    };

    const onSubmit = async (data: EventFormData) => {
        setIsSubmitting(true);
        try {
            await eventService.createEvent(data);
            showToast('Event created successfully!', 'success');
            setTimeout(() => {
                router.push('/dashboard/events');
            }, 1500);
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to create event', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
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
                            <div className="relative">
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
                            </div>
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
                                    transition-all duration-300
                                    ${isSubmitting
                                        ? 'bg-slate/50 cursor-not-allowed'
                                        : 'bg-coral hover:bg-coral-hover shadow-lg hover:shadow-xl hover:shadow-coral/30'
                                    }
                                    btn-asymmetric
                                `}
                            >
                                {isSubmitting ? 'Creating Event...' : 'Create Event'}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>

                {/* Preview Section - 40% */}
                <div className="lg:col-span-2">
                    <EventPreview formData={formData} />
                </div>
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
