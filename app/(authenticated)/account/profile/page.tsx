"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Phone, ShieldCheck } from "lucide-react";
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
    <div className="max-w-4xl mx-auto space-y-8 pb-24 px-1">
      {/* Header Section */}
      <div className="px-1">
        <h1 className="text-2xl font-black text-foreground tracking-tight">
          Profile Settings
        </h1>
        <p className="text-foreground/50 text-sm font-medium">
          Manage your personal information and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* SECTION 1: BASIC INFO */}
        <section className="bg-background rounded-[2.5rem] p-6 sm:p-8 border border-foreground/5 shadow-2xl transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red">
              <User size={24} />
            </div>
            <div>
              <h2 className="font-black text-foreground uppercase text-xs tracking-widest">
                Basic Information
              </h2>
              <p className="text-[10px] text-foreground/40 font-bold uppercase">
                Publicly identifiable details
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              className="h-14 rounded-2xl shadow-lg shadow-brand-red/10"
            />
          </form>
        </section>

        {/* SECTION 2: SECURITY */}
        <section className="bg-background rounded-[2.5rem] p-6 sm:p-8 border border-foreground/5 shadow-2xl transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center text-foreground/60">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="font-black text-foreground uppercase text-xs tracking-widest">
                Security
              </h2>
              <p className="text-[10px] text-foreground/40 font-bold uppercase">
                Manage your login credentials
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <PasswordInput
                label="Current Password"
                name="old_password"
                value={passwordData.old_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    old_password: e.target.value,
                  })
                }
                placeholder="••••••••"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <PasswordInput
                  label="New Password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password: e.target.value,
                    })
                  }
                  placeholder="Min. 8 characters"
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
              </div>
            </div>

            <SubmitButton
              isLoading={isUpdatingPassword}
              idleText="Update Password"
              loadingText="Securing..."
              className="h-14 rounded-2xl shadow-lg shadow-brand-red/10"
            />
          </form>
        </section>
      </div>
    </div>
  );
}
