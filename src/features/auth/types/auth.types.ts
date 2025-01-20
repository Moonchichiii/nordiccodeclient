export interface AuthUser {
    id: number;
    email: string;
    fullName: string;
    phoneNumber?: string;
    streetAddress?: string;
    city?: string;
    stateOrRegion?: string;
    postalCode?: string;
    country?: string;
    vatNumber?: string;
    acceptedTerms: boolean;
    marketingConsent: boolean;
    isVerified: boolean;
    isActive: boolean;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    email: string;
    password1: string;
    password2: string;
    full_name?: string;
    phone_number?: string;
    street_address?: string;
    city?: string;
    state_or_region?: string;
    postal_code?: string;
    country?: string;
    vat_number?: string;
    accepted_terms: boolean;
    marketing_consent?: boolean;
  }
  
  export interface AuthResponse {
    access: string;
    refresh: string;
    user: AuthUser;
    access_expiration: string;
    refresh_expiration: string;
  }
  
  export interface EmailConfirmationResponse {
    detail: string;
    access_token: string;
    refresh_token: string;
  }
  
  export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export type AuthMode = 'login' | 'register' | 'forgot-password';