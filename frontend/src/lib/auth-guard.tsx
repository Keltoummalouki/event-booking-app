'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getCurrentUser } from '@/services/auth.service';

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
 * Admin guard: Ensures only admins can access the route
 * Redirects unauthenticated users to /login
 * Redirects participants to /events (Catalog)
 */
export function useAdminGuard() {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        const user = getCurrentUser();
        if (user && user.role !== 'ADMIN') {
            // If user is logged in but not an admin (i.e. PARTICIPANT), redirect to catalog
            router.push('/events');
        }
    }, [router]);
}

/**
 * Hook to handle role-based redirection after login
 */
export function useRoleRedirect() {
    const router = useRouter();

    const redirectBasedOnRole = () => {
        const user = getCurrentUser();
        if (!user) return;

        if (user.role === 'ADMIN') {
            router.push('/dashboard');
        } else {
            router.push('/events');
        }
    };

    return { redirectBasedOnRole };
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

