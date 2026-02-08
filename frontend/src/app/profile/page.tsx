'use client';

import { motion } from 'framer-motion';
import PublicHeader from '@/components/layout/PublicHeader';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-cream dark:bg-navy-dark">
            <PublicHeader />
            <main className="pt-32 px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-serif text-3xl font-bold text-navy dark:text-white mb-6">
                        My Profile
                    </h1>
                    <div className="p-8 bg-white dark:bg-navy rounded-2xl shadow-sm border border-slate/10 dark:border-white/5">
                        <p className="text-slate dark:text-gray-300">
                            Profile management coming soon.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
