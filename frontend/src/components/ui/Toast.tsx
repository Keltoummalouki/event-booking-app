'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

const TOAST_ICONS = {
    success: CheckCircle,
    error: XCircle,
    info: AlertCircle,
};

const TOAST_STYLES = {
    success: 'bg-success/10 border-success text-success',
    error: 'bg-error/10 border-error text-error',
    info: 'bg-coral/10 border-coral text-coral',
};

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
    const Icon = TOAST_ICONS[type];

    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm ${TOAST_STYLES[type]}`}
        >
            <Icon size={20} />
            <p className="text-sm font-medium flex-1">{message}</p>
            <button
                onClick={onClose}
                className="hover:opacity-70 transition-opacity"
                aria-label="Close notification"
            >
                <X size={18} />
            </button>
        </motion.div>
    );
}

interface ToastContainerProps {
    toasts: Array<{ id: string; message: string; type: ToastType }>;
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => onRemove(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
