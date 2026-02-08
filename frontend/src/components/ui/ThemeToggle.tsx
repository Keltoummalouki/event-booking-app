'use client';

import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return skeleton to prevent layout shift
        return (
            <div className="w-12 h-12 rounded-lg bg-slate/10 animate-pulse" />
        );
    }

    const isDark = resolvedTheme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
                relative w-12 h-12
                flex items-center justify-center
                rounded-lg
                transition-all duration-300
                group
                ${isDark
                    ? 'bg-navy-dark/80 ring-1 ring-white/10'
                    : 'bg-white ring-1 ring-slate/10'
                }
            `}
            style={{
                borderRadius: '6px 16px 6px 16px', // Asymmetric
            }}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            {/* Glow effect on hover */}
            <motion.div
                className={`
                    absolute inset-0 rounded-lg opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300
                    ${isDark ? 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' : ''}
                `}
                style={{ borderRadius: '6px 16px 6px 16px' }}
            />

            <AnimatePresence mode="wait">
                {isDark ? (
                    <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <Sun
                            size={20}
                            className="text-coral group-hover:text-coral/80 transition-colors"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <Moon
                            size={20}
                            className="text-navy group-hover:text-navy/70 transition-colors"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Animated border accent */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-coral origin-center"
                initial={{ width: 0 }}
                whileHover={{ width: '60%' }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
}
