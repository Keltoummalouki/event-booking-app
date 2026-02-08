'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface RoleCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
}

export default function RoleCard({
    icon: Icon,
    title,
    description,
    isSelected,
    onClick,
}: RoleCardProps) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            className={`
        relative w-full p-6 text-left rounded-lg border-2 transition-colors duration-300
        ${isSelected
                    ? 'border-coral bg-coral/5'
                    : 'border-slate/20 bg-white hover:border-slate/40'
                }
      `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            {/* Selection Indicator */}
            <motion.div
                className="absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                animate={{
                    borderColor: isSelected ? '#F97316' : '#64748B40',
                    backgroundColor: isSelected ? '#F97316' : 'transparent',
                }}
                transition={{ duration: 0.2 }}
            >
                <motion.div
                    className="w-2 h-2 rounded-full bg-white"
                    initial={false}
                    animate={{ scale: isSelected ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </motion.div>

            {/* Icon */}
            <motion.div
                className={`
          w-12 h-12 rounded-lg flex items-center justify-center mb-4
          ${isSelected ? 'bg-coral text-white' : 'bg-slate/10 text-slate'}
        `}
                animate={{
                    backgroundColor: isSelected ? '#F97316' : '#64748B15',
                    color: isSelected ? '#FFFFFF' : '#64748B',
                }}
                transition={{ duration: 0.3 }}
            >
                <Icon size={24} />
            </motion.div>

            {/* Content */}
            <h3 className={`font-semibold text-lg mb-1 ${isSelected ? 'text-coral' : 'text-navy'}`}>
                {title}
            </h3>
            <p className="text-slate text-sm">
                {description}
            </p>

            {/* Haptic Pulse Effect */}
            {isSelected && (
                <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-coral"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                />
            )}
        </motion.button>
    );
}
