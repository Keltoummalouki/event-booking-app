const API_URL = 'http://localhost:3000';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'PARTICIPANT';
  };
}

export interface RegisterData {
  email: string;
  password: string;
  role: 'ADMIN' | 'PARTICIPANT';
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error('Invalid email or password');
    }
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const register = async (data: RegisterData): Promise<{ id: string; email: string }> => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 409) {
      throw new Error('An account with this email already exists');
    }
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};