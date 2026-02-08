'use client';

import { motion } from 'framer-motion';
import { EventStatus } from '@/types/event.types';

interface StatusToggleProps {
    value: EventStatus;
    onChange: (status: EventStatus) => void;
    disabled?: boolean;
}

export default function StatusToggle({ value, onChange, disabled = false }: StatusToggleProps) {
    const isDraft = value === 'DRAFT';

    const handleToggle = () => {
        if (disabled) return;
        onChange(isDraft ? 'PUBLISHED' : 'DRAFT');
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-navy dark:text-cream">
                Event Status
            </label>
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={`
                    relative w-full h-14 rounded-lg overflow-hidden
                    transition-all duration-300
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    border-2 ${isDraft ? 'border-slate/30' : 'border-coral'}
                `}
            >
                {/* Background */}
                <motion.div
                    initial={false}
                    animate={{
                        backgroundColor: isDraft ? '#F8F8F8' : '#F97316',
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                />

                {/* Sliding indicator */}
                <motion.div
                    initial={false}
                    animate={{
                        x: isDraft ? 0 : '100%',
                    }}
                    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute inset-y-0 left-0 w-1/2 bg-white/30 backdrop-blur-sm"
                />

                {/* Labels */}
                <div className="relative h-full flex items-center justify-between px-6">
                    <motion.span
                        animate={{
                            color: isDraft ? '#0F172A' : '#FFFFFF',
                            fontWeight: isDraft ? 600 : 400,
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-sm uppercase tracking-wide"
                    >
                        Draft
                    </motion.span>
                    <motion.span
                        animate={{
                            color: isDraft ? '#64748B' : '#FFFFFF',
                            fontWeight: isDraft ? 400 : 600,
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-sm uppercase tracking-wide"
                    >
                        Published
                    </motion.span>
                </div>
            </button>
            <p className="text-xs text-slate">
                {isDraft
                    ? 'Event is saved as draft and not visible to participants'
                    : 'Event is live and visible to all participants'}
            </p>
        </div>
    );
}
