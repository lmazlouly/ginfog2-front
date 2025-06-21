"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useBreadcrumbs } from "@/contexts/breadcrumb-context";
import { changePassword } from "@/lib/api/generated/auth/auth";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();

  // Fields for password change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/" },
      { label: "Change Password", href: "/profile-settings/change-password" },
    ]);
  }, [setBreadcrumbs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      });

      toast({
        title: "Success",
        description: "Password changed successfully.",
      });

      // Optionally clear form or refresh
      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Change Password</h2>
      <p className="text-sm text-gray-500 mb-6">
        Make sure to use a strong password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div>
          <Label htmlFor="oldPassword" className="text-sm font-medium">
            Old Password
          </Label>
          <Input
            id="oldPassword"
            type="password"
            placeholder="••••••••"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="newPassword" className="text-sm font-medium">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Label
            htmlFor="newPasswordConfirmation"
            className="text-sm font-medium"
          >
            Confirm New Password
          </Label>
          <Input
            id="newPasswordConfirmation"
            type="password"
            placeholder="••••••••"
            value={newPasswordConfirmation}
            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="mt-4">
          Update Password
        </Button>
      </form>
    </div>
  );
}
