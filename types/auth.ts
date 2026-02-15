export interface User {
    id: number;
    name: string;
    phone: string;
    tenant_id: number;
    lastname: string;
    email: string;
    role: string;
    status: string;
    middle_name: string;
    bvn: string;
    nin: string;
    dob: string;
    referral_id: string;
    email_verified_at: string | null;
    last_login: string;
    profile_photo_path: string;
    created_at: string;
    is_identity_verified: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    lastname: string;
    email: string;
    phone: string;
    password?: string;
    currency?: string;
    refer_id?: string;
}

export interface OnboardingData { 
    email: string; 
    domain: string;
    password: string;
    admin_password?: string;
    monnify_key: string;
    monnify_secret: string;
    monnify_contract: string;
}

export interface ResetPasswordData {
    email: string;
    password?: string;
}

export interface AuthResponse<T = unknown> {
    status: 'success' | 'error';
    message: string;
    data: T;
}