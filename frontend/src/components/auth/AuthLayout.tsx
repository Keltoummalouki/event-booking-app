'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    heroTitle?: string;
    heroSubtitle?: string;
}

export default function AuthLayout({
    children,
    heroTitle = "The Hub for Knowledge",
    heroSubtitle = "Connect. Learn. Grow."
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-cream">
            {/* Hero Section - 60% on desktop */}
            <motion.div
                className="relative w-full lg:w-[60%] min-h-[40vh] lg:min-h-screen overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            >
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')`,
                    }}
                >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/70 to-transparent" />
                </div>

                {/* Typography Overlay */}
                <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-16">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <h1 className="font-serif text-4xl lg:text-6xl xl:text-7xl text-white tracking-tight-custom leading-tight mb-4">
                            {heroTitle}
                        </h1>
                        <p className="text-cream-dark/80 text-lg lg:text-xl max-w-md">
                            {heroSubtitle}
                        </p>
                    </motion.div>

                    {/* Decorative Element */}
                    <motion.div
                        className="absolute top-8 left-8 lg:top-16 lg:left-16"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-coral" />
                            <span className="text-white/60 text-sm tracking-widest uppercase">Event Booking</span>
                        </div>
                    </motion.div>

                    {/* Floating Stats */}
                    <motion.div
                        className="hidden lg:flex absolute top-1/3 right-8 flex-col gap-6"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                    >
                        {[
                            { value: '500+', label: 'Events' },
                            { value: '10k+', label: 'Participants' },
                            { value: '50+', label: 'Speakers' },
                        ].map((stat, index) => (
                            <div key={index} className="text-right">
                                <div className="text-white font-serif text-2xl">{stat.value}</div>
                                <div className="text-white/50 text-xs uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* Form Section - 40% on desktop */}
            <motion.div
                className="w-full lg:w-[40%] min-h-[60vh] lg:min-h-screen flex items-center justify-center p-8 lg:p-12"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="w-full max-w-md">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
