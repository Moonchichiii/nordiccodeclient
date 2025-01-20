export interface ProfileUpdateData {
    full_name: string;
    phone_number: string;
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    marketing_consent: boolean;
  }
  
  export interface PasswordChangeData {
    old_password: string;
    new_password: string;
    confirm_password?: string;
  }
  
  export interface SettingsResponse {
    success: boolean;
    detail: string;
  }