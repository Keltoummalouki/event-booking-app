'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export default function Toast({
    message,
    type,
    isVisible,
    onClose,
    duration = 5000,
}: ToastProps) {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const Icon = type === 'success' ? CheckCircle : AlertCircle;
    const bgColor = type === 'success' ? 'bg-success' : 'bg-error';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={`
            fixed bottom-6 right-6 z-50 
            flex items-center gap-3 py-4 px-6 
            ${bgColor} text-white
            shadow-2xl
          `}
                    style={{
                        borderRadius: '8px 24px 8px 24px', // Asymmetric
                    }}
                    initial={{
                        x: 100,
                        y: 20,
                        opacity: 0,
                        scale: 0.9,
                    }}
                    animate={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 1,
                    }}
                    exit={{
                        x: 100,
                        y: -20,
                        opacity: 0,
                        scale: 0.9,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                    }}
                >
                    <motion.div
                        initial={{ rotate: -90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                    >
                        <Icon size={24} />
                    </motion.div>

                    <span className="font-medium max-w-xs">{message}</span>

                    <button
                        onClick={onClose}
                        className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Close notification"
                    >
                        <X size={18} />
                    </button>

                    {/* Progress bar for auto-dismiss */}
                    {duration > 0 && (
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-white/30"
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: duration / 1000, ease: 'linear' }}
                            style={{
                                borderBottomLeftRadius: '8px',
                            }}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
