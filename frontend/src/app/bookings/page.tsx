'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight, Trash2 } from 'lucide-react';
import PublicHeader from '@/components/layout/PublicHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { eventService, Booking } from '@/services/event.service';
import Swal from 'sweetalert2';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await eventService.getMyBookings();
                setBookings(data);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancel = async (bookingId: string) => {
        const result = await Swal.fire({
            title: 'Cancel Reservation?',
            text: "Are you sure you want to cancel this booking?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, cancel it',
            background: '#1e293b',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await eventService.cancelBooking(bookingId);

                setBookings(prev => prev.filter(b => b.id !== bookingId));

                Swal.fire({
                    title: 'Cancelled!',
                    text: 'Your reservation has been cancelled.',
                    icon: 'success',
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#f97316'
                });
            } catch (error) {
                console.error('Failed to cancel:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to cancel reservation.',
                    icon: 'error',
                    background: '#1e293b',
                    color: '#fff'
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-cream dark:bg-navy-dark">
            <PublicHeader />

            <main className="pt-32 px-6 pb-12 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-serif text-3xl font-bold text-navy dark:text-white mb-2">
                        My Bookings
                    </h1>
                    <p className="text-slate dark:text-slate-400 mb-8">
                        View and manage your event reservations.
                    </p>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-navy rounded-2xl border border-slate/10 dark:border-white/5">
                            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                            <h3 className="text-xl font-medium text-navy dark:text-white mb-2">No bookings yet</h3>
                            <p className="text-slate dark:text-slate-400 mb-6 max-w-md mx-auto">
                                You haven't booked any events yet. Explore our upcoming events and save your spot!
                            </p>
                            <Link
                                href="/events"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white rounded-lg font-medium hover:bg-coral-hover transition-colors"
                            >
                                Explore Events
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {bookings.map((booking, index) => (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group bg-white dark:bg-navy rounded-xl overflow-hidden border border-slate/10 dark:border-white/5 hover:shadow-lg hover:border-coral/20 transition-all duration-300 flex flex-col"
                                    >
                                        {/* Event Image (Fallback) */}
                                        <div className="h-40 bg-slate-100 dark:bg-navy-light relative overflow-hidden">
                                            {booking.event?.coverImageUrl ? (
                                                <img
                                                    src={booking.event.coverImageUrl}
                                                    alt={booking.event.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-navy/5 to-coral/5 dark:from-white/5 dark:to-coral/10" />
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-white/90 dark:bg-navy/90 backdrop-blur-sm shadow-sm ${booking.status === 'CONFIRMED' ? 'text-success' :
                                                        booking.status === 'REJECTED' ? 'text-error' :
                                                            'text-warning'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="font-serif text-xl font-bold text-navy dark:text-white mb-3 line-clamp-1">
                                                {booking.event?.title || 'Unknown Event'}
                                            </h3>

                                            <div className="space-y-2 mb-6 flex-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <Calendar className="w-4 h-4 text-coral" />
                                                    <span>{booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'TBD'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <Clock className="w-4 h-4 text-coral" />
                                                    <span>{booking.event?.date ? new Date(booking.event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <MapPin className="w-4 h-4 text-coral" />
                                                    <span className="truncate">{booking.event?.location || 'TBD'}</span>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate/10 dark:border-white/5 flex justify-between items-center text-xs text-slate-500">
                                                <span>Booked {new Date(booking.createdAt).toLocaleDateString()}</span>

                                                <div className="flex items-center gap-3">
                                                    {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                                                        <button
                                                            onClick={() => handleCancel(booking.id)}
                                                            className="text-error hover:text-error/80 font-medium flex items-center gap-1 hover:underline"
                                                            title="Cancel Reservation"
                                                        >
                                                            <Trash2 size={14} />
                                                            Cancel
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/events/${booking.event?.id}`}
                                                        className="text-coral hover:text-coral-hover font-medium underline-offset-4 hover:underline"
                                                    >
                                                        Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
