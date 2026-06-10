"use client";

import { useState, useEffect } from "react";
import { User, Lock, Save, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { usersApi, authApi } from "@/lib/api";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error("All profile fields are required");
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await usersApi.update(user.userId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        isActive: true
      });

      if (res.data.success) {
        updateUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        });
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || res.data.error || "Failed to update profile");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (securityData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await authApi.changePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword
      });

      if (res.data.success) {
        toast.success("Password updated successfully!");
        setSecurityData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        toast.error(res.data.message || res.data.error || "Failed to update password");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your admin profile and security</p>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-white dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-white dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  required
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" loading={isSavingProfile} leftIcon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={securityData.currentPassword}
                  onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                  className="w-full bg-white dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    className="w-full bg-white dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    className="w-full bg-white dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                    required
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" loading={isUpdatingPassword} variant="outline" leftIcon={<Lock className="w-4 h-4" />}>
                  Update Password
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
