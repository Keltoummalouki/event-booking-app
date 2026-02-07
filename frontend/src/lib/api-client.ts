/**
 * Centralized API Client for Event Booking App
 * Handles automatic token injection, error interception, and retry logic
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

export class ApiClientError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public originalError?: unknown
    ) {
        super(message);
        this.name = 'ApiClientError';
    }
}

/**
 * Get auth token from localStorage (client-side only)
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

/**
 * Clear auth data and redirect to login
 */
function clearAuthAndRedirect(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Only redirect if not already on login page
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
}

/**
 * Build headers with automatic token injection
 */
function buildHeaders(customHeaders?: HeadersInit): Record<string, string> {
    const token = getAuthToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Merge custom headers
    if (customHeaders) {
        if (customHeaders instanceof Headers) {
            customHeaders.forEach((value, key) => {
                headers[key] = value;
            });
        } else if (Array.isArray(customHeaders)) {
            customHeaders.forEach(([key, value]) => {
                headers[key] = value;
            });
        } else {
            Object.assign(headers, customHeaders);
        }
    }

    // Add Authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * Handle API errors with automatic 401 interception
 */
async function handleApiError(response: Response): Promise<never> {
    let errorMessage = 'Request failed';
    let errorData: ApiError | null = null;

    try {
        errorData = await response.json();
        errorMessage = errorData?.message || errorMessage;
    } catch {
        // If JSON parsing fails, use status-based messages
        switch (response.status) {
            case 400:
                errorMessage = 'Invalid request data';
                break;
            case 401:
                errorMessage = 'Authentication required';
                // Clear auth and redirect to login
                clearAuthAndRedirect();
                break;
            case 403:
                errorMessage = 'Access forbidden';
                break;
            case 404:
                errorMessage = 'Resource not found';
                break;
            case 500:
                errorMessage = 'Server error. Please try again later.';
                break;
            default:
                errorMessage = `Request failed with status ${response.status}`;
        }
    }

    // Special handling for 401 - always clear auth
    if (response.status === 401) {
        clearAuthAndRedirect();
    }

    throw new ApiClientError(errorMessage, response.status, errorData || undefined);
}

/**
 * Centralized fetch wrapper with automatic token injection and error handling
 */
export async function apiClient<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: buildHeaders(options.headers),
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return undefined as T;
        }

        return response.json();
    } catch (error) {
        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new ApiClientError(
                'Cannot connect to server. Please check if the backend is running.',
                0,
                error
            );
        }

        // Re-throw ApiClientError
        if (error instanceof ApiClientError) {
            throw error;
        }

        // Wrap unknown errors
        throw new ApiClientError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            0,
            error
        );
    }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
    get: <T = unknown>(endpoint: string, options?: RequestInit) =>
        apiClient<T>(endpoint, { ...options, method: 'GET' }),

    post: <T = unknown>(endpoint: string, data?: unknown, options?: RequestInit) =>
        apiClient<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),

    put: <T = unknown>(endpoint: string, data?: unknown, options?: RequestInit) =>
        apiClient<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),

    patch: <T = unknown>(endpoint: string, data?: unknown, options?: RequestInit) =>
        apiClient<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T = unknown>(endpoint: string, options?: RequestInit) =>
        apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};

/**
 * Wait for token to be available in localStorage
 * Useful for preventing race conditions after login
 */
export async function waitForToken(maxAttempts = 10, delayMs = 50): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
        const token = getAuthToken();
        if (token) return token;
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    return null;
}
