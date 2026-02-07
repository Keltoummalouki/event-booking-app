'use client';

import { EventStatus } from '@/types/event.types';

interface StatusBadgeProps {
    status: EventStatus;
    variant?: 'default' | 'prominent';
    className?: string;
}

const STATUS_CONFIG: Record<EventStatus, { bg: string; text: string; label: string }> = {
    DRAFT: {
        bg: 'bg-slate/20',
        text: 'text-slate',
        label: 'Draft',
    },
    PUBLISHED: {
        bg: 'bg-coral/15',
        text: 'text-coral',
        label: 'Published',
    },
    CANCELED: {
        bg: 'bg-error/15',
        text: 'text-error',
        label: 'Canceled',
    },
};

export default function StatusBadge({ status, variant = 'default', className = '' }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status];

    if (variant === 'prominent') {
        return (
            <span
                className={`
                    inline-flex items-center gap-1.5 px-4 py-1.5
                    ${config.bg} ${config.text}
                    text-sm font-semibold tracking-wide
                    btn-asymmetric
                    shadow-sm
                    ${className}
                `}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {config.label}
            </span>
        );
    }

    return (
        <span
            className={`
                inline-block px-3 py-1
                ${config.bg} ${config.text}
                text-xs font-medium tracking-wide
                rounded-full
                ${className}
            `}
        >
            {config.label}
        </span>
    );
}
