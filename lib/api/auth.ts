import api from "../axios";
import {
  LoginCredentials,
  RegisterData,
  OnboardingData,
  ResetPasswordData,
} from "@/types/auth";
export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export const authApi = {
  onboarding: (data: OnboardingData) => api.post("/auth/onboarding", data),

  login: (credentials: LoginCredentials) =>
    api.post("/auth/login", credentials),

  register: (data: RegisterData) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    return api.post("/auth/register", data, {
      headers: {
        "X-Tenant-Domain": origin,
      },
    });
  },

  verifyEmail: (data: { email: string; otp: string }) =>
    api.post("/auth/verify-email", data),

  forgotPassword: (data: { email: string }) =>
    api.post("/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordData) =>
    api.post("/auth/reset-password", data),

  resendOtp: (data: { email: string }) => api.post("/auth/resend-otp", data),

  contactUs: (data: ContactData) => api.post("/auth/contact-us", data),
};
