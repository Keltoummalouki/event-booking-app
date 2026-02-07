'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { eventService } from '@/services/event.service';
import { waitForToken } from '@/lib/api-client';
import EventCard from '@/components/dashboard/EventCard';
import EventSkeleton from '@/components/dashboard/EventSkeleton';
import EventGrid from '@/components/dashboard/EventGrid';
import EmptyState from '@/components/dashboard/EmptyState';
import CreateEventModal from '@/components/dashboard/CreateEventModal';
import { ToastContainer, ToastType } from '@/components/ui/Toast';
import { CreateEventDto } from '@/types/event.types';

interface ToastData {
    id: string;
    message: string;
    type: ToastType;
}

export default function DashboardPage() {
    const { events, isLoading, refetch } = useEvents();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const [isTokenReady, setIsTokenReady] = useState(false);

    // Wait for token before fetching - prevents race conditions
    useEffect(() => {
        const checkToken = async () => {
            const token = await waitForToken();
            if (token) {
                setIsTokenReady(true);
            }
        };
        checkToken();
    }, []);

    // Refetch when token becomes ready
    useEffect(() => {
        if (isTokenReady) {
            refetch();
        }
    }, [isTokenReady, refetch]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const handleCreateEvent = async (data: CreateEventDto) => {
        try {
            await eventService.createEvent(data);
            showToast('Event created successfully!', 'success');
            await refetch();
        } catch (error) {
            showToast(
                error instanceof Error ? error.message : 'Failed to create event',
                'error'
            );
            throw error;
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);

    return (
        <div className="min-h-screen">
            {/* Toast Container */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Create Event Modal */}
            <CreateEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateEvent}
            />

            {/* Main Container - Asymmetric padding */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                {/* Header - Asymmetric Layout with massive typography */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="pl-0 lg:pl-4">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="font-serif text-5xl lg:text-7xl font-bold text-navy tracking-tight-custom mb-2"
                            >
                                Event Canvas
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-slate text-lg lg:text-xl"
                            >
                                Craft memorable experiences with elegance
                            </motion.p>
                        </div>

                        {/* Create Button - Magnetic asymmetric */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleOpenModal}
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-coral text-white rounded-lg shadow-lg btn-magnetic btn-asymmetric font-medium text-lg self-start lg:self-auto"
                        >
                            <Plus size={22} />
                            Create Event
                        </motion.button>
                    </div>

                    {/* Decorative line - Asymmetric gradient */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-8 h-px bg-gradient-to-r from-coral via-coral/20 to-transparent origin-left"
                    />
                </motion.header>

                {/* Events Grid - Silent failure shows EmptyState for clean UI */}
                <EventGrid>
                    {isLoading ? (
                        <EventSkeleton count={6} />
                    ) : events.length === 0 ? (
                        <EmptyState onCreateEvent={handleOpenModal} />
                    ) : (
                        events.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                        ))
                    )}
                </EventGrid>

                {/* Stats Footer */}
                {!isLoading && events.length > 0 && (
                    <motion.footer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 pt-8 border-t border-slate/10"
                    >
                        <div className="flex items-center justify-between text-sm text-slate">
                            <p>
                                Showing <span className="font-medium text-navy">{events.length}</span> event{events.length !== 1 ? 's' : ''}
                            </p>
                            <p className="text-xs">
                                Last updated: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </motion.footer>
                )}
            </div>
        </div>
    );
}
