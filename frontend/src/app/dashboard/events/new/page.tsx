'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EventForm from '@/components/admin/EventForm';
import { useAuthGuard } from '@/lib/auth-guard';

export default function NewEventPage() {
    // Protect this route - redirect to login if not authenticated
    useAuthGuard();
    return (
        <div className="min-h-screen bg-cream dark:bg-navy-deep">
            <main className="px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Link
                        href="/dashboard/events"
                        className="inline-flex items-center gap-2 text-slate hover:text-coral transition-colors mb-4"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <h1 className="text-4xl font-bold text-navy dark:text-cream font-serif mb-2">
                        Create New Event
                    </h1>
                    <p className="text-slate">
                        Fill in the details below to create a new event
                    </p>
                </motion.div>

                {/* Event Form with Live Preview */}
                <EventForm />
            </main>
        </div>
    );
}
