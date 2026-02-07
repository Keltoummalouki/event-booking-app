'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/services/auth.service';

/**
 * Client-side authentication guard for protected routes
 * Redirects to /login if user is not authenticated
 */
export function useAuthGuard() {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [router]);
}

/**
 * Higher-order component to protect routes
 * Usage: export default withAuth(YourComponent);
 */
export function withAuth<P extends object>(
    Component: React.ComponentType<P>
): React.FC<P> {
    return function AuthenticatedComponent(props: P) {
        useAuthGuard();
        return <Component {...props} />;
    };
}
