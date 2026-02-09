'use client';

interface StatusBadgeProps {
    status: string;
    variant?: 'default' | 'prominent';
    className?: string;
}

export default function StatusBadge({ status, variant = 'default', className = '' }: StatusBadgeProps) {

    const getStatusConfig = (status: string) => {
        const normalizedStatus = status?.toUpperCase();

        switch (normalizedStatus) {
            // Event Statuses
            case 'PUBLISHED':
                return { styles: 'bg-success/10 text-success border-success/20', label: 'Published' };
            case 'DRAFT':
                return { styles: 'bg-slate/20 text-slate-500 border-slate-200 dark:border-slate-700', label: 'Draft' };

            // Booking Statuses
            case 'CONFIRMED':
                return { styles: 'bg-success/10 text-success border-success/20', label: 'Confirmed' };
            case 'PENDING':
                return { styles: 'bg-warning/10 text-warning border-warning/20', label: 'Pending' };
            case 'REFUSED':
            case 'REJECTED':
                return { styles: 'bg-error/10 text-error border-error/20', label: 'Refused' };
            case 'CANCELED':
            case 'CANCELLED':
                return { styles: 'bg-slate-500/10 text-slate-500 border-slate-500/20', label: 'Canceled' };

            default:
                return { styles: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700', label: status };
        }
    };

    const config = getStatusConfig(status);

    if (variant === 'prominent') {
        return (
            <span
                className={`
                    inline-flex items-center gap-1.5 px-4 py-1.5
                    ${config.styles}
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
                ${config.styles}
                text-xs font-medium tracking-wide
                rounded-full border
                ${className}
            `}
        >
            {config.label}
        </span>
    );
}
