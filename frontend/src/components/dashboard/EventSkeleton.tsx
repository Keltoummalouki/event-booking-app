'use client';

import { motion } from 'framer-motion';

interface EventSkeletonProps {
    count?: number;
}

export default function EventSkeleton({ count = 3 }: EventSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                    }}
                    className="relative bg-white overflow-hidden shadow-layered clip-corner-br"
                >
                    {/* Image skeleton with angled corner */}
                    <div className="h-48 bg-slate/10 clip-angle-top animate-shimmer relative">
                        {/* Date skeleton */}
                        <div className="absolute bottom-4 left-4">
                            <div className="h-3 w-8 bg-white/20 rounded mb-1 animate-shimmer" />
                            <div className="h-8 w-10 bg-white/20 rounded animate-shimmer" />
                        </div>
                    </div>

                    {/* Status badge skeleton - overlapping position */}
                    <div className="absolute top-44 right-6">
                        <div className="h-7 w-24 bg-slate/10 btn-asymmetric animate-shimmer" />
                    </div>

                    <div className="p-6 pt-8">
                        {/* Title skeleton */}
                        <div className="mb-3">
                            <div className="h-6 bg-slate/10 rounded w-3/4 animate-shimmer" />
                        </div>

                        {/* Description skeleton */}
                        <div className="mb-4 space-y-2">
                            <div className="h-4 bg-slate/10 rounded w-full animate-shimmer" />
                            <div className="h-4 bg-slate/10 rounded w-5/6 animate-shimmer" />
                        </div>

                        {/* Details skeleton */}
                        <div className="flex gap-4 mb-4">
                            <div className="h-4 bg-slate/10 rounded w-24 animate-shimmer" />
                            <div className="h-4 bg-slate/10 rounded w-20 animate-shimmer" />
                        </div>

                        {/* Progress bar skeleton */}
                        <div className="mb-4">
                            <div className="flex justify-between mb-1.5">
                                <div className="h-3 bg-slate/10 rounded w-16 animate-shimmer" />
                                <div className="h-3 bg-slate/10 rounded w-20 animate-shimmer" />
                            </div>
                            <div className="h-1.5 bg-slate/10 rounded-full animate-shimmer" />
                        </div>

                        {/* Organizer skeleton */}
                        <div className="pt-3 border-t border-slate/10">
                            <div className="h-3 bg-slate/10 rounded w-32 animate-shimmer" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </>
    );
}
