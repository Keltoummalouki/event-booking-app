const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'PARTICIPANT';
    firstName?: string;
    lastName?: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PARTICIPANT';
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

/**
 * Login user with email and password
 * @throws Error with descriptive message if login fails
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Handle HTTP errors
    if (!response.ok) {
      let errorMessage = 'Login failed';

      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If JSON parsing fails, use status-based messages
        if (response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (response.status === 404) {
          errorMessage = 'Authentication endpoint not found. Please check your backend URL.';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = `Login failed with status ${response.status}`;
        }
      }

      throw new Error(errorMessage);
    }

    const data: LoginResponse = await response.json();

    // Validate response structure
    if (!data.access_token || !data.user) {
      throw new Error('Invalid response from server');
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }

    // Re-throw other errors
    throw error;
  }
};

/**
 * Register a new user
 * @throws Error with descriptive message if registration fails
 */
export const register = async (data: RegisterData): Promise<{ id: string; email: string }> => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Registration failed';

      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        if (response.status === 409) {
          errorMessage = 'An account with this email already exists';
        } else if (response.status === 400) {
          errorMessage = 'Invalid registration data';
        } else {
          errorMessage = `Registration failed with status ${response.status}`;
        }
      }

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }

    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): LoginResponse['user'] | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Logout user by clearing localStorage
 */
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
