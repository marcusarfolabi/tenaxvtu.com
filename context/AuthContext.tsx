"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { User, LoginCredentials, AuthResponse } from "@/types/auth";
import { authApi } from "@/lib/api/auth";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { profileApi } from "@/lib/api/profile";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
  refreshUser: () => Promise<void>;  
  isAuthenticated: boolean;
  isIdentityVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(() => Cookies.get("auth_token") || null);
  
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user_data");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const [isIdentityVerified, setIsIdentityVerified] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("is_identity_verified") === "true";
    }
    return false;
  });

  const syncUser = useCallback((userData: User, verified: boolean) => {
    setUser(userData);
    setIsIdentityVerified(verified);
    localStorage.setItem("user_data", JSON.stringify(userData));
    localStorage.setItem("is_identity_verified", String(verified));
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      const { token: newToken, user: userData, is_identity_verified } = response.data.data;

      const isProd = process.env.NODE_ENV === "production";
      Cookies.set("auth_token", newToken, { expires: 7, secure: isProd, sameSite: "strict" });
      Cookies.set("user_role", userData.role, { expires: 7, secure: isProd, sameSite: "strict" });
      
      setToken(newToken);
      syncUser(userData, !!is_identity_verified);

      toast.success(`Welcome back, ${userData.name}!`);

      if (userData.role === "admin") router.push("/admin");
      else if (userData.role === "agent") router.push("/dashboard");
      else router.push("/account");
      
    } catch (error) {
      const err = error as AxiosError<AuthResponse>;
      throw new Error(err.response?.data?.message || "An unexpected error occurred");
    }
  };

  const refreshUser = async () => {
    try {
      const response = await profileApi.getProfile(); 
      const { user: userData, is_identity_verified } = response.data.data;
      
      syncUser(userData, !!is_identity_verified);
      console.log("User data refreshed successfully");
    } catch (err) {
      console.error("Failed to refresh user data", err);
    }
  };

  const updateUser = (userData: User) => syncUser(userData, isIdentityVerified);

  const logout = () => {
    profileApi.logout().catch(() => {});  
    setToken(null);
    setUser(null);
    setIsIdentityVerified(false);
    
    Cookies.remove("auth_token");
    Cookies.remove("user_role");
    localStorage.removeItem("user_data");
    localStorage.removeItem("is_identity_verified");
    
    router.push("/login");
  };

  const value = {
    user,
    token,
    login,
    logout,
    updateUser,
    refreshUser, 
    isAuthenticated: !!token,
    isIdentityVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};