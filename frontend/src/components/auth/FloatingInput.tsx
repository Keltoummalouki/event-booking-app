'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FloatingInputProps {
    label: string;
    type?: 'text' | 'email' | 'password';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    name?: string;
    required?: boolean;
    autoComplete?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ label, type = 'text', value, onChange, error, name, required, autoComplete }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const [showPassword, setShowPassword] = useState(false);

        const isActive = isFocused || value.length > 0;
        const inputType = type === 'password' && showPassword ? 'text' : type;

        return (
            <div className="relative mb-6">
                {/* Input Container */}
                <div className="relative">
                    <input
                        ref={ref}
                        type={inputType}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        required={required}
                        autoComplete={autoComplete}
                        className={`
              w-full py-4 px-0 bg-transparent border-0 border-b-2 
              text-navy text-lg outline-none transition-colors duration-300
              ${error ? 'border-error' : isFocused ? 'border-coral' : 'border-slate/30'}
              ${type === 'password' ? 'pr-12' : ''}
            `}
                    />

                    {/* Floating Label */}
                    <motion.label
                        className={`
              absolute left-0 pointer-events-none origin-left
              ${error ? 'text-error' : isActive ? 'text-coral' : 'text-slate'}
            `}
                        initial={false}
                        animate={{
                            y: isActive ? -28 : 16,
                            scale: isActive ? 0.85 : 1,
                            x: 0,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                        }}
                    >
                        {label}
                    </motion.label>

                    {/* Animated Underline */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-coral"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isFocused ? 1 : 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                        }}
                        style={{ originX: 0 }}
                    />

                    {/* Password Toggle */}
                    {type === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate hover:text-coral transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: showPassword ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </motion.div>
                        </button>
                    )}
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.p
                            className="text-error text-sm mt-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

FloatingInput.displayName = 'FloatingInput';

export default FloatingInput;
