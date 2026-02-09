'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Shield, Save, Check } from 'lucide-react';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
}

const SettingsCard = ({
    title,
    icon: Icon,
    children,
    onSave,
    isSaved,
    isSaving,
}: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    onSave: () => void;
    isSaved: boolean;
    isSaving: boolean;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative bg-white overflow-hidden shadow-layered rounded-lg p-6"
    >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-coral" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-navy">{title}</h2>
            </div>

            {/* Save Button */}
            <motion.button
                onClick={onSave}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isSaved
                    ? 'bg-success/10 text-success'
                    : 'bg-coral/10 text-coral hover:bg-coral hover:text-white'
                    }`}
            >
                {isSaved ? (
                    <>
                        <Check size={16} />
                        Saved
                    </>
                ) : (
                    <>
                        <Save size={16} />
                        Save
                    </>
                )}
            </motion.button>
        </div>

        {/* Content */}
        <div className="space-y-4">{children}</div>
    </motion.div>
);

const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description,
}: {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
}) => (
    <div className="flex items-center justify-between py-3 border-b border-slate/10 last:border-0">
        <div>
            <p className="text-sm font-medium text-navy">{label}</p>
            {description && <p className="text-xs text-slate mt-0.5">{description}</p>}
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-coral' : 'bg-slate/20'
                }`}
        >
            <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm ${checked ? 'left-7' : 'left-1'
                    }`}
            />
        </button>
    </div>
);

export default function SettingsPage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [savedSection, setSavedSection] = useState<string | null>(null);

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        eventReminders: true,
        bookingConfirmations: true,
        marketingEmails: false,
    });

    // Appearance preferences
    const [appearance, setAppearance] = useState({
        theme: 'light',
        compactMode: false,
    });

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                console.error('Failed to parse user data');
            }
        }
    }, []);

    const handleSaveSection = async (section: string) => {
        setIsSaving(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsSaving(false);
        setSavedSection(section);
        setTimeout(() => setSavedSection(null), 2000);
    };

    return (
        <div className="min-h-screen">
            {/* Main Container - Asymmetric padding */}
            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                {/* Header - Asymmetric Layout with massive typography */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="pl-0 lg:pl-4">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="font-serif text-5xl lg:text-6xl font-bold text-navy tracking-tight-custom mb-2"
                        >
                            Settings
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-slate text-lg"
                        >
                            Manage your account preferences
                        </motion.p>
                    </div>

                    {/* Decorative line - Asymmetric gradient */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-8 h-px bg-gradient-to-r from-coral via-coral/20 to-transparent origin-left"
                    />
                </motion.header>

                {/* Settings Sections */}
                <div className="space-y-8">
                    {/* Profile Section */}
                    <SettingsCard
                        title="Profile"
                        icon={User}
                        onSave={() => handleSaveSection('profile')}
                        isSaved={savedSection === 'profile'}
                        isSaving={isSaving}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={user?.firstName || ''}
                                    onChange={(e) =>
                                        setUser((prev) =>
                                            prev ? { ...prev, firstName: e.target.value } : null
                                        )
                                    }
                                    className="w-full px-4 py-3 bg-cream/50 border border-slate/10 rounded-lg text-navy focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={user?.lastName || ''}
                                    onChange={(e) =>
                                        setUser((prev) =>
                                            prev ? { ...prev, lastName: e.target.value } : null
                                        )
                                    }
                                    className="w-full px-4 py-3 bg-cream/50 border border-slate/10 rounded-lg text-navy focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral/20 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-3 bg-slate/5 border border-slate/10 rounded-lg text-slate cursor-not-allowed"
                            />
                            <p className="text-xs text-slate/60 mt-1">
                                Contact support to change your email address
                            </p>
                        </div>
                    </SettingsCard>

                    {/* Notifications Section */}
                    <SettingsCard
                        title="Notifications"
                        icon={Bell}
                        onSave={() => handleSaveSection('notifications')}
                        isSaved={savedSection === 'notifications'}
                        isSaving={isSaving}
                    >
                        <ToggleSwitch
                            checked={notifications.emailAlerts}
                            onChange={(value) =>
                                setNotifications((prev) => ({ ...prev, emailAlerts: value }))
                            }
                            label="Email Alerts"
                            description="Receive important account alerts via email"
                        />
                        <ToggleSwitch
                            checked={notifications.eventReminders}
                            onChange={(value) =>
                                setNotifications((prev) => ({ ...prev, eventReminders: value }))
                            }
                            label="Event Reminders"
                            description="Get notified before your events start"
                        />
                        <ToggleSwitch
                            checked={notifications.bookingConfirmations}
                            onChange={(value) =>
                                setNotifications((prev) => ({
                                    ...prev,
                                    bookingConfirmations: value,
                                }))
                            }
                            label="Booking Confirmations"
                            description="Receive confirmation when bookings are made"
                        />
                        <ToggleSwitch
                            checked={notifications.marketingEmails}
                            onChange={(value) =>
                                setNotifications((prev) => ({ ...prev, marketingEmails: value }))
                            }
                            label="Marketing Emails"
                            description="Receive updates about new features and promotions"
                        />
                    </SettingsCard>

                    {/* Appearance Section */}
                    <SettingsCard
                        title="Appearance"
                        icon={Palette}
                        onSave={() => handleSaveSection('appearance')}
                        isSaved={savedSection === 'appearance'}
                        isSaving={isSaving}
                    >
                        <div>
                            <label className="block text-xs font-medium text-slate uppercase tracking-wider mb-3">
                                Theme
                            </label>
                            <div className="flex gap-3">
                                {['light', 'dark', 'system'].map((theme) => (
                                    <button
                                        key={theme}
                                        onClick={() =>
                                            setAppearance((prev) => ({ ...prev, theme }))
                                        }
                                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300 ${appearance.theme === theme
                                            ? 'bg-coral text-white'
                                            : 'bg-slate/10 text-slate hover:bg-coral/10 hover:text-coral'
                                            }`}
                                    >
                                        {theme}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ToggleSwitch
                            checked={appearance.compactMode}
                            onChange={(value) =>
                                setAppearance((prev) => ({ ...prev, compactMode: value }))
                            }
                            label="Compact Mode"
                            description="Reduce spacing and padding throughout the interface"
                        />
                    </SettingsCard>

                    {/* Security Section */}
                    <SettingsCard
                        title="Security"
                        icon={Shield}
                        onSave={() => handleSaveSection('security')}
                        isSaved={savedSection === 'security'}
                        isSaving={isSaving}
                    >
                        <div className="py-3 border-b border-slate/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-navy">Password</p>
                                    <p className="text-xs text-slate mt-0.5">
                                        Last changed 30 days ago
                                    </p>
                                </div>
                                <button className="px-4 py-2 text-sm font-medium text-coral hover:bg-coral/10 rounded-lg transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                        <div className="py-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-navy">
                                        Two-Factor Authentication
                                    </p>
                                    <p className="text-xs text-slate mt-0.5">
                                        Add an extra layer of security to your account
                                    </p>
                                </div>
                                <button className="px-4 py-2 text-sm font-medium bg-coral/10 text-coral hover:bg-coral hover:text-white rounded-lg transition-colors">
                                    Enable 2FA
                                </button>
                            </div>
                        </div>
                    </SettingsCard>
                </div>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 pt-8 border-t border-slate/10"
                >
                    <p className="text-xs text-slate text-center">
                        Need help?{' '}
                        <a href="#" className="text-coral hover:underline">
                            Contact Support
                        </a>
                    </p>
                </motion.footer>
            </div>
        </div>
    );
}
