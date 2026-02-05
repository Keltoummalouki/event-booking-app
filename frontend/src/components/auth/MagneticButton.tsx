'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface MagneticButtonProps {
    children: ReactNode;
    type?: 'button' | 'submit';
    onClick?: () => void;
    isLoading?: boolean;
    loadingProgress?: number;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    className?: string;
}

export default function MagneticButton({
    children,
    type = 'button',
    onClick,
    isLoading = false,
    loadingProgress = 0,
    disabled = false,
    variant = 'primary',
    className = '',
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Magnetic effect values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 15 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    // Scale on hover
    const scale = useMotionValue(1);
    const springScale = useSpring(scale, { stiffness: 300, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current || disabled || isLoading) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = (e.clientX - centerX) * 0.15;
        const distanceY = (e.clientY - centerY) * 0.15;

        x.set(distanceX);
        y.set(distanceY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        scale.set(1);
    };

    const handleMouseEnter = () => {
        if (!disabled && !isLoading) {
            scale.set(1.02);
        }
    };

    const baseStyles = variant === 'primary'
        ? 'bg-coral text-white hover:bg-coral-hover'
        : 'bg-transparent text-navy border-2 border-navy hover:bg-navy hover:text-white';

    return (
        <motion.button
            ref={buttonRef}
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
        relative w-full py-4 px-8 btn-asymmetric font-semibold text-lg
        overflow-hidden transition-colors duration-300
        disabled:opacity-60 disabled:cursor-not-allowed
        ${baseStyles}
        ${className}
      `}
            style={{
                x: springX,
                y: springY,
                scale: springScale,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            whileTap={{ scale: 0.98 }}
        >
            {/* Progress Bar Loader */}
            {isLoading && (
                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-white/30"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Animated Loading Overlay */}
            {isLoading && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{
                        x: ['-100%', '100%'],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            )}

            {/* Button Content */}
            <motion.span
                className="relative z-10 flex items-center justify-center gap-2"
                animate={{
                    opacity: isLoading ? 0.7 : 1,
                }}
            >
                {isLoading ? 'Loading...' : children}
            </motion.span>

            {/* Hover Glow Effect */}
            <motion.div
                className="absolute inset-0 opacity-0 bg-gradient-to-r from-coral/20 via-coral/10 to-transparent -z-10"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
}
