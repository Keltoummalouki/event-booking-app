'use client';

import { motion } from 'framer-motion';
import { Calendar, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard/events', icon: <LayoutDashboard size={20} /> },
    { id: 'events', label: 'Events', href: '/dashboard/events', icon: <Calendar size={20} /> },
    { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
];

export default function FloatingNav() {
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed left-6 top-6 z-50"
        >
            <div
                className="relative overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-navy/80 border border-slate/20"
                style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.1)',
                }}
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-coral/5 to-transparent pointer-events-none" />

                <div className="relative px-4 py-6 space-y-2">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.id} href={item.href}>
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg
                                        transition-all duration-300 cursor-pointer
                                        ${isActive
                                            ? 'bg-coral text-white shadow-lg shadow-coral/30'
                                            : 'text-navy dark:text-cream hover:bg-coral/10'
                                        }
                                    `}
                                >
                                    {item.icon}
                                    <span className="font-medium text-sm whitespace-nowrap">
                                        {item.label}
                                    </span>
                                </motion.div>
                            </Link>
                        );
                    })}

                    {/* Logout Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-error hover:bg-error/10 transition-all duration-300"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Logout</span>
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
}
