'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CustomDatePickerProps {
    value: string;
    onChange: (date: string) => void;
    error?: string;
    disabled?: boolean;
}

export default function CustomDatePicker({ value, onChange, error, disabled = false }: CustomDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(value ? new Date(value) : new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        onChange(date.toISOString().split('T')[0]);
        setIsOpen(false);
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const goToPreviousMonth = () => {
        setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const goToNextMonth = () => {
        setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div ref={containerRef} className="relative space-y-2">
            <label className="block text-sm font-medium text-navy dark:text-cream">
                Event Date <span className="text-coral">*</span>
            </label>

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full px-4 py-3 rounded-lg border-2 
                    flex items-center justify-between
                    transition-all duration-300
                    ${error ? 'border-error' : 'border-slate/30 focus:border-coral'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-coral/50'}
                    bg-white dark:bg-navy/50
                `}
            >
                <span className={value ? 'text-navy dark:text-cream' : 'text-slate'}>
                    {value ? formatDate(new Date(value)) : 'Select event date'}
                </span>
                <Calendar size={18} className="text-coral" />
            </button>

            {error && (
                <p className="text-xs text-error">{error}</p>
            )}

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 mt-2 w-full bg-white dark:bg-navy border-2 border-coral rounded-lg shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-coral text-white px-4 py-3 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={goToPreviousMonth}
                            className="hover:bg-white/20 rounded p-1 transition-colors"
                        >
                            ←
                        </button>
                        <span className="font-semibold">
                            {monthNames[currentMonth]} {currentYear}
                        </span>
                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="hover:bg-white/20 rounded p-1 transition-colors"
                        >
                            →
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="p-4">
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <div key={day} className="text-center text-xs font-semibold text-slate">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {emptyDays.map((_, index) => (
                                <div key={`empty-${index}`} />
                            ))}
                            {days.map((day) => {
                                const date = new Date(currentYear, currentMonth, day);
                                date.setHours(0, 0, 0, 0);
                                const isPast = date < today;
                                const isSelected = value && new Date(value).toDateString() === date.toDateString();

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => !isPast && handleDateSelect(date)}
                                        disabled={isPast}
                                        className={`
                                            aspect-square rounded-lg text-sm font-medium
                                            transition-all duration-200
                                            ${isPast
                                                ? 'text-slate/30 cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-coral text-white shadow-lg'
                                                    : 'text-navy dark:text-cream hover:bg-coral/10 hover:text-coral'
                                            }
                                        `}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
