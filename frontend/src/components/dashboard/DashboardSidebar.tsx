'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Settings, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Events', href: '/dashboard/events' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed left-0 top-0 h-screen w-20 glass-enhanced z-30 flex flex-col items-center py-8"
        >
            {/* Logo */}
            <div className="mb-12">
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="w-12 h-12 bg-gradient-coral rounded-lg flex items-center justify-center text-white font-serif text-xl font-bold shadow-lg"
                >
                    E
                </motion.div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-4">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <motion.button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            whileHover={{ scale: 1.1, x: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group ${isActive
                                    ? 'bg-coral text-white glow-coral'
                                    : 'text-slate hover:text-coral hover:bg-coral/10'
                                }`}
                            title={item.label}
                            aria-label={item.label}
                        >
                            <Icon size={20} />

                            {/* Tooltip */}
                            <span className="absolute left-full ml-4 px-3 py-2 bg-navy text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                                {item.label}
                            </span>

                            {/* Active indicator with glow */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-coral rounded-l-full shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Logout */}
            <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-lg flex items-center justify-center text-slate/70 hover:text-error hover:bg-error/10 transition-all duration-300 group"
                title="Logout"
                aria-label="Logout"
            >
                <LogOut size={20} />

                {/* Tooltip */}
                <span className="absolute left-full ml-4 px-3 py-2 bg-navy text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    Logout
                </span>
            </motion.button>
        </motion.aside>
    );
}
