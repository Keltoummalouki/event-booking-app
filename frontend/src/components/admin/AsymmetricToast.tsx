'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error';

interface AsymmetricToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export default function AsymmetricToast({
    message,
    type,
    isVisible,
    onClose,
    duration = 4000,
}: AsymmetricToastProps) {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const Icon = type === 'success' ? CheckCircle : XCircle;
    const bgColor = type === 'success' ? 'bg-success' : 'bg-error';
    const iconColor = type === 'success' ? 'text-success' : 'text-error';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: 400, y: 20, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    exit={{ x: 400, y: -20, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                    className="fixed top-6 right-6 z-[100] max-w-md"
                >
                    <div
                        className="relative overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-navy/95 border-2 shadow-2xl"
                        style={{
                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
                            borderColor: type === 'success' ? '#22C55E' : '#EF4444',
                        }}
                    >
                        {/* Accent bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${bgColor}`} />

                        <div className="flex items-start gap-3 p-4 pl-6">
                            <Icon className={`${iconColor} flex-shrink-0 mt-0.5`} size={20} />
                            <p className="flex-1 text-sm font-medium text-navy dark:text-cream pr-2">
                                {message}
                            </p>
                            <button
                                onClick={onClose}
                                className="flex-shrink-0 text-slate hover:text-navy dark:hover:text-cream transition-colors"
                                aria-label="Close notification"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Progress bar */}
                        {duration > 0 && (
                            <motion.div
                                initial={{ scaleX: 1 }}
                                animate={{ scaleX: 0 }}
                                transition={{ duration: duration / 1000, ease: 'linear' }}
                                className={`h-1 ${bgColor} origin-left`}
                            />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
