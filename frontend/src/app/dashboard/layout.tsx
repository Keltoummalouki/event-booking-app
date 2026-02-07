import { ReactNode } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-cream">
            <DashboardSidebar />
            <main className="flex-1 ml-20">
                {children}
            </main>
        </div>
    );
}
