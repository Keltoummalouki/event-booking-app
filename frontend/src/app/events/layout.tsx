import PublicHeader from '@/components/layout/PublicHeader';

export default function EventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-cream dark:bg-navy-dark transition-colors duration-300">
            <PublicHeader />
            <main>
                {children}
            </main>
        </div>
    );
}
