"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Phone, Lock, Save, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import FormInput from "@/components/common/FormInput";
import { PasswordInput } from "@/components/common/PasswordInput";
import SubmitButton from "@/components/common/SubmitButton";
import { profileApi } from "@/lib/api/profile";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    lastname: user?.lastname || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const response = await profileApi.update(profileData);
      updateUser(response.data.data);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      return toast.error("Passwords do not match");
    }
    if (passwordData.new_password == passwordData.old_password) {
      return toast.error("Please, use choose a new password");
    }
    setIsUpdatingPassword(true);
    try {
      await profileApi.changePassword(passwordData);
      toast.success("Password updated. Please login with your new password.");

      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Password update failed");
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 px-1">
      <div>
        <h1 className="text-2xl font-black text-brand-black tracking-tight">
          Profile Settings
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Manage your personal information and security.
        </p>
      </div>

      <section className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold">
            <User size={20} />
          </div>
          <h2 className="font-black text-gray-900">Basic Information</h2>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-8">
            <FormInput
              label="First Name"
              name="name"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              icon={User}
              placeholder="First Name"
            />
            <FormInput
              label="Last Name"
              name="lastname"
              value={profileData.lastname}
              onChange={(e) =>
                setProfileData({ ...profileData, lastname: e.target.value })
              }
              icon={User}
              placeholder="Last Name"
            />
          </div>

          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            inputMode="tel"
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
            icon={Phone}
            placeholder="080..."
          />

          <SubmitButton
            isLoading={isUpdatingProfile}
            idleText="Save Changes"
            loadingText="Updating..."
            className="h-14 rounded-2xl"
          />
        </form>
      </section>

      {/* SECTION 2: SECURITY */}
      <section className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
            <ShieldCheck size={20} />
          </div>
          <h2 className="font-black text-gray-900">Security</h2>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-8">
          <PasswordInput
            label="Current Password"
            name="old_password"
            value={passwordData.old_password}
            onChange={(e) =>
              setPasswordData({ ...passwordData, old_password: e.target.value })
            }
            placeholder="••••••••"
          />

          <PasswordInput
            label="New Password"
            name="new_password"
            value={passwordData.new_password}
            onChange={(e) =>
              setPasswordData({ ...passwordData, new_password: e.target.value })
            }
            placeholder="Minimum 8 characters"
          />

          <PasswordInput
            label="Confirm New Password"
            name="new_password_confirmation"
            value={passwordData.new_password_confirmation}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                new_password_confirmation: e.target.value,
              })
            }
            placeholder="Confirm new password"
          />

          <SubmitButton
            isLoading={isUpdatingPassword}
            idleText="Update Password"
            loadingText="Securing..."
            className="h-14 rounded-2xl bg-brand-black hover:bg-brand-gold hover:text-brand-black"
          />
        </form>
      </section>
    </div>
  );
}
