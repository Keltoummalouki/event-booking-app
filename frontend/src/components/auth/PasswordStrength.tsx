'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface PasswordStrengthProps {
    password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    const strength = useMemo(() => {
        if (!password) return { score: 0, label: '', color: 'bg-slate/20' };

        let score = 0;

        // Length checks
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;

        // Character variety checks
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^a-zA-Z0-9]/.test(password)) score += 1;

        // Determine level
        if (score <= 2) {
            return { score: 1, label: 'Weak', color: 'bg-error' };
        } else if (score <= 4) {
            return { score: 2, label: 'Medium', color: 'bg-coral' };
        } else {
            return { score: 3, label: 'Strong', color: 'bg-success' };
        }
    }, [password]);

    if (!password) return null;

    return (
        <div className="mb-4">
            {/* Strength Bar */}
            <div className="flex gap-1.5 h-1.5 mb-2">
                {[1, 2, 3].map((level) => (
                    <motion.div
                        key={level}
                        className={`flex-1 rounded-full ${level <= strength.score ? strength.color : 'bg-slate/20'
                            }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: level <= strength.score ? 1 : 0.3 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                            delay: level * 0.05,
                        }}
                        style={{ originX: 0 }}
                    />
                ))}
            </div>

            {/* Label */}
            <motion.p
                className={`text-xs ${strength.score === 1 ? 'text-error' :
                        strength.score === 2 ? 'text-coral' : 'text-success'
                    }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Password strength: {strength.label}
            </motion.p>
        </div>
    );
}
