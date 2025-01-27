export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  street_address?: string;
  city?: string;
  state_or_region?: string;
  postal_code?: string;
  country?: string;
  vat_number?: string;
  accepted_terms: boolean;
  marketing_consent: boolean;
  is_verified: boolean;
  is_active: boolean;
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

export interface RegisterResponse {
  detail: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: AuthUser;
  access_expiration: string;
  refresh_expiration: string;
}
