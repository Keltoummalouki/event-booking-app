'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Search, Filter } from 'lucide-react';
import { eventService, Booking, ReservationStatus } from '@/services/event.service';
import StatusBadge from '@/components/ui/StatusBadge';
import Swal from 'sweetalert2';

interface BookingListProps {
    eventId: string;
}

export default function BookingList({ eventId }: BookingListProps) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'ALL' | ReservationStatus>('ALL');

    useEffect(() => {
        loadBookings();
    }, [eventId]);

    const loadBookings = async () => {
        setIsLoading(true);
        try {
            const data = await eventService.getBookingsByEvent(eventId);
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (bookingId: string, newStatus: ReservationStatus) => {
        try {
            await eventService.updateBookingStatus(bookingId, newStatus);

            // Optimistic update
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1e293b',
                color: '#fff'
            });

            Toast.fire({
                icon: 'success',
                title: `Booking ${newStatus.toLowerCase()}`
            });

        } catch (error) {
            console.error('Failed to update status:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update booking status.',
                icon: 'error',
                background: '#1e293b',
                color: '#fff'
            });
        }
    };

    const confirmAction = (bookingId: string, action: 'confirm' | 'reject') => {
        Swal.fire({
            title: action === 'confirm' ? 'Confirm Booking?' : 'Reject Booking?',
            text: `Are you sure you want to ${action} this booking?`,
            icon: action === 'confirm' ? 'question' : 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'confirm' ? '#22c55e' : '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: action === 'confirm' ? 'Yes, confirm' : 'Yes, reject',
            background: '#1e293b',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                handleUpdateStatus(bookingId, action === 'confirm' ? 'CONFIRMED' : 'REFUSED');
            }
        });
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.participant.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.participant.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'ALL' || booking.status === filter;

        return matchesSearch && matchesFilter;
    });

    if (isLoading) {
        return <div className="text-center py-8 text-slate-500">Loading bookings...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-navy-light border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-coral/50"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                    <Filter className="w-4 h-4 text-slate-400" />
                    {(['ALL', 'PENDING', 'CONFIRMED', 'REFUSED', 'CANCELED'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === f
                                ? 'bg-navy text-white dark:bg-white dark:text-navy'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                }`}
                        >
                            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-navy rounded-xl border border-slate/10 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate/10 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Participant</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate/10 dark:divide-white/5">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-navy dark:text-white">
                                                {booking.participant.firstName} {booking.participant.lastName}
                                            </div>
                                            <div className="text-xs text-slate-500">{booking.participant.email}</div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                            {new Date(booking.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-slate-400">
                                                {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="p-4 text-right">
                                            {booking.status === 'PENDING' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => confirmAction(booking.id, 'confirm')}
                                                        className="p-1 text-success hover:bg-success/10 rounded-md transition-colors"
                                                        title="Confirm"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmAction(booking.id, 'reject')}
                                                        className="p-1 text-error hover:bg-error/10 rounded-md transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )}
                                            {booking.status === 'CONFIRMED' && (
                                                <button
                                                    onClick={() => confirmAction(booking.id, 'reject')}
                                                    className="text-xs text-error hover:underline"
                                                >
                                                    Reject
                                                </button>
                                            )}
                                            {booking.status === 'REFUSED' && (
                                                <span className="text-xs text-slate-400">Refused</span>
                                            )}
                                            {booking.status === 'CANCELED' && (
                                                <span className="text-xs text-slate-400">Canceled</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
