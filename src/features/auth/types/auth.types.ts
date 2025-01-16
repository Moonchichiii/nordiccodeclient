export interface AuthUser {
    id: string;
    email: string;
    fullName?: string;
    isVerified: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    password2: string;
    fullName?: string;
    acceptedTerms: boolean;
    marketingConsent?: boolean;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: AuthUser;
    accessExpiration: string;
    refreshExpiration: string;
}

export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export type AuthMode = 'login' | 'register' | 'forgot-password';