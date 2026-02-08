'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { eventService, Booking } from '@/services/event.service';
import Swal from 'sweetalert2';

interface BookingListProps {
    eventId: string;
}

export default function BookingList({ eventId }: BookingListProps) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'REJECTED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const data = await eventService.getBookingsByEvent(eventId);
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load bookings.',
                icon: 'error',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#f97316'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchBookings();
        }
    }, [eventId]);

    const handleUpdateStatus = async (bookingId: string, newStatus: 'CONFIRMED' | 'REJECTED') => {
        try {
            await eventService.updateBookingStatus(bookingId, newStatus);

            // Optimistic update
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));

            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#1e293b',
                color: '#fff'
            });

            toast.fire({
                icon: newStatus === 'CONFIRMED' ? 'success' : 'info',
                title: `Booking ${newStatus === 'CONFIRMED' ? 'confirmed' : 'rejected'}`
            });

        } catch (error) {
            console.error('Failed to update status:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update status.',
                icon: 'error',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#f97316'
            });
        }
    };

    const confirmAction = (bookingId: string, action: 'confirm' | 'reject') => {
        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${action} this booking?`,
            icon: action === 'confirm' ? 'question' : 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'confirm' ? '#22c55e' : '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: action === 'confirm' ? 'Yes, confirm it!' : 'Yes, reject it!',
            background: '#1e293b',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                handleUpdateStatus(bookingId, action === 'confirm' ? 'CONFIRMED' : 'REJECTED');
            }
        });
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'ALL' || booking.status === filter;
        const matchesSearch =
            booking.participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (booking.participant.firstName && booking.participant.firstName.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <h2 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                    Bookings <span className="text-sm font-sans font-normal text-foreground-muted">({bookings.length})</span>
                </h2>
                <button
                    onClick={fetchBookings}
                    className="p-2 rounded-lg hover:bg-slate/5 dark:hover:bg-white/5 transition-colors text-foreground-muted"
                    title="Refresh List"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/10 focus:ring-coral/50 outline-none text-sm"
                    />
                </div>
                <div className="flex gap-2 text-sm bg-white dark:bg-card-bg p-1 rounded-lg ring-1 ring-slate/10 dark:ring-white/10">
                    {(['ALL', 'PENDING', 'CONFIRMED', 'REJECTED'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md transition-colors ${filter === f
                                    ? 'bg-navy dark:bg-white text-white dark:text-navy font-medium'
                                    : 'text-foreground-muted hover:text-foreground'
                                }`}
                        >
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate/10 dark:border-white/5 rounded-lg">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-foreground-muted/50" />
                        <p className="text-foreground-muted">No bookings found</p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {filteredBookings.map((booking) => (
                            <motion.div
                                key={booking.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-4 rounded-lg bg-white dark:bg-card-bg ring-1 ring-slate/10 dark:ring-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:shadow-lg transition-shadow"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-foreground">
                                            {booking.participant.firstName || 'User'}
                                            <span className="text-foreground-muted font-normal text-sm ml-2 hidden sm:inline">
                                                ({booking.participant.email})
                                            </span>
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${booking.status === 'CONFIRMED' ? 'bg-success/10 text-success' :
                                                booking.status === 'REJECTED' ? 'bg-error/10 text-error' :
                                                    'bg-warning/10 text-warning'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-foreground-muted sm:hidden mb-1">{booking.participant.email}</p>
                                    <p className="text-xs text-foreground-muted">
                                        Booked on {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    {booking.status === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => confirmAction(booking.id, 'confirm')}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-success/10 text-success hover:bg-success hover:text-white rounded-lg transition-colors text-xs font-medium"
                                                title="Confirm"
                                            >
                                                <CheckCircle size={16} />
                                                <span className="sm:hidden">Confirm</span>
                                            </button>
                                            <button
                                                onClick={() => confirmAction(booking.id, 'reject')}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-error/10 text-error hover:bg-error hover:text-white rounded-lg transition-colors text-xs font-medium"
                                                title="Reject"
                                            >
                                                <XCircle size={16} />
                                                <span className="sm:hidden">Reject</span>
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'CONFIRMED' && (
                                        <button
                                            onClick={() => confirmAction(booking.id, 'reject')}
                                            className="ml-auto text-xs text-error/70 hover:text-error hover:underline"
                                        >
                                            Revoke
                                        </button>
                                    )}
                                    {booking.status === 'REJECTED' && (
                                        <button
                                            onClick={() => confirmAction(booking.id, 'confirm')}
                                            className="ml-auto text-xs text-success/70 hover:text-success hover:underline"
                                        >
                                            Restore
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
