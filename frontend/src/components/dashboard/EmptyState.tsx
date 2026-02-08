'use client';

import { motion } from 'framer-motion';
import { Sparkles, Calendar } from 'lucide-react';

interface EmptyStateProps {
    onCreateEvent: () => void;
}

export default function EmptyState({ onCreateEvent }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="col-span-full flex flex-col items-center justify-center py-20 px-4"
            style={{ marginLeft: '-5%' }} // Asymmetric offset
        >
            {/* Decorative SVG Illustration with Float Animation */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative mb-8 group"
            >
                {/* Calendar Icon with hover float effect */}
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "loop"
                    }}
                    className="relative"
                    whileHover={{
                        y: -12,
                        transition: { duration: 0.3 }
                    }}
                >
                    <svg
                        width="160"
                        height="160"
                        viewBox="0 0 160 160"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-coral transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                    >
                        {/* Abstract calendar/event shape */}
                        <rect
                            x="30"
                            y="40"
                            width="100"
                            height="90"
                            rx="8"
                            fill="currentColor"
                            fillOpacity="0.1"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <rect
                            x="30"
                            y="40"
                            width="100"
                            height="24"
                            rx="8"
                            fill="currentColor"
                            fillOpacity="0.2"
                        />
                        {/* Calendar dots */}
                        <circle cx="55" cy="85" r="6" fill="currentColor" fillOpacity="0.3" />
                        <circle cx="80" cy="85" r="6" fill="currentColor" fillOpacity="0.5" />
                        <circle cx="105" cy="85" r="6" fill="currentColor" />
                        <circle cx="55" cy="110" r="6" fill="currentColor" fillOpacity="0.2" />
                        <circle cx="80" cy="110" r="6" fill="currentColor" fillOpacity="0.2" />
                        {/* Decorative strokes */}
                        <path
                            d="M50 28V40"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <path
                            d="M110 28V40"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        {/* Sparkle accents */}
                        <circle cx="140" cy="35" r="3" fill="currentColor" fillOpacity="0.6" />
                        <circle cx="20" cy="90" r="2" fill="currentColor" fillOpacity="0.4" />
                    </svg>
                </motion.div>

                {/* Floating sparkle icon */}
                <motion.div
                    animate={{
                        y: [-2, 4, -2],
                        rotate: [0, 10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-2 -right-2"
                >
                    <Sparkles className="w-6 h-6 text-coral drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                </motion.div>
            </motion.div>

            {/* Typography */}
            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-serif text-3xl font-semibold text-foreground mb-3 text-center tracking-tight-custom"
            >
                Your journey starts here
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-foreground-muted text-center max-w-sm mb-8 leading-relaxed"
            >
                Create your first event and start building memorable experiences for your audience.
            </motion.p>

            {/* CTA Button with Glow */}
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{
                    scale: 1.02,
                    boxShadow: '0 0 30px rgba(249, 115, 22, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onCreateEvent}
                className="px-8 py-4 bg-gradient-coral text-white rounded-lg shadow-lg btn-magnetic btn-asymmetric font-medium text-lg"
            >
                Create Your First Event
            </motion.button>

            {/* Decorative line */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-12 h-px w-32 bg-gradient-to-r from-transparent via-coral/30 to-transparent"
            />
        </motion.div>
    );
}
