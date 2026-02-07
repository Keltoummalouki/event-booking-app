'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            await onRetry();
        } finally {
            // Small delay to show loading state
            setTimeout(() => setIsRetrying(false), 500);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            className="col-span-full"
        >
            <div className="relative max-w-2xl mx-auto">
                {/* Asymmetric container */}
                <div className="bg-white/80 backdrop-blur-sm border border-error/10 overflow-hidden clip-corner-br shadow-layered">
                    <div className="p-8 md:p-10">
                        <div className="flex items-start gap-5">
                            {/* Icon container with subtle glow */}
                            <div className="flex-shrink-0 p-3 bg-coral/10 rounded-lg">
                                <AlertCircle className="w-7 h-7 text-coral" />
                            </div>

                            <div className="flex-1 min-w-0">
                                {/* Title - Serif font, not harsh */}
                                <h3 className="font-serif text-2xl font-semibold text-navy mb-2 tracking-tight-custom">
                                    Something went wrong
                                </h3>

                                {/* Error message - Readable slate text */}
                                <p className="text-slate leading-relaxed mb-6">
                                    {error}
                                </p>

                                {/* Retry button with loading state */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleRetry}
                                    disabled={isRetrying}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-coral text-white rounded-lg btn-magnetic btn-asymmetric font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw
                                        size={18}
                                        className={isRetrying ? 'animate-spin' : ''}
                                    />
                                    {isRetrying ? 'Retrying...' : 'Try Again'}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Decorative accent line */}
                    <div className="h-1 bg-gradient-to-r from-coral via-coral/50 to-transparent" />
                </div>

                {/* Subtle background decoration */}
                <div className="absolute -z-10 top-4 left-4 right-4 bottom-4 bg-coral/5 rounded-lg blur-xl" />
            </div>
        </motion.div>
    );
}
