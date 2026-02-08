'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, History, Ticket } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { isAuthenticated, getCurrentUser, logout } from '@/services/auth.service';

export default function PublicHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ firstName?: string; email: string } | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        // Check auth status
        const checkAuth = () => {
            const authenticated = isAuthenticated();
            setIsLoggedIn(authenticated);
            if (authenticated) {
                const currentUser = getCurrentUser();
                if (currentUser) {
                    setUser({
                        firstName: currentUser.firstName,
                        email: currentUser.email
                    });
                }
            }
        };

        checkAuth();

        // Handle scroll for glass effect
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('storage', checkAuth); // Listen for storage changes (e.g. login/logout in other tabs)

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
        setUser(null);
        router.push('/login');
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-cream/80 dark:bg-navy-dark/80 backdrop-blur-md shadow-sm border-b border-slate/5' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-coral rounded-lg flex items-center justify-center text-white font-serif font-bold shadow-lg transform group-hover:rotate-3 transition-transform">
                        E
                    </div>
                    <span className="font-serif text-xl font-bold text-navy dark:text-white hidden sm:block">
                        Event Booking App
                    </span>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-4 sm:gap-6">
                    <nav className="flex items-center gap-2">
                        {isLoggedIn ? (
                            <>
                                {/* Initial Avatar / Welcome */}
                                <div className="hidden md:flex items-center gap-2 mr-4 text-sm">
                                    <span className="text-slate dark:text-gray-400">Hello,</span>
                                    <span className="font-medium text-navy dark:text-white">
                                        {user?.firstName || user?.email?.split('@')[0] || 'User'}
                                    </span>
                                </div>

                                {/* History Link */}
                                <Link href="/bookings">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 rounded-lg text-slate hover:text-coral hover:bg-slate/5 dark:text-gray-400 dark:hover:text-coral dark:hover:bg-white/5 transition-colors relative group"
                                        title="My Bookings (History)"
                                    >
                                        <History size={20} />
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-coral rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.button>
                                </Link>

                                {/* Profile Link */}
                                <Link href="/profile">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 rounded-lg text-slate hover:text-coral hover:bg-slate/5 dark:text-gray-400 dark:hover:text-coral dark:hover:bg-white/5 transition-colors relative group"
                                        title="Profile"
                                    >
                                        <User size={20} />
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-coral rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.button>
                                </Link>

                                {/* Logout Button */}
                                <motion.button
                                    onClick={handleLogout}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-lg text-slate hover:text-error hover:bg-error/10 dark:text-gray-400 dark:hover:text-error dark:hover:bg-error/10 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <button className="px-4 py-2 text-sm font-medium text-navy dark:text-white hover:text-coral transition-colors">
                                        Sign In
                                    </button>
                                </Link>
                                <Link href="/register">
                                    <button className="px-4 py-2 text-sm font-medium bg-coral text-white rounded-lg hover:bg-coral-hover transition-colors shadow-lg hover:shadow-coral/20">
                                        Get Started
                                    </button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Divider */}
                    <div className="h-6 w-px bg-slate/10 dark:bg-white/10" />

                    {/* Theme Toggle */}
                    <ThemeToggle />
                </div>
            </div>
        </motion.header>
    );
}
