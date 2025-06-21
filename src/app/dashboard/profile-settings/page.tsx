"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, AtSign, Mail } from "lucide-react";
import { updateProfile } from "@/lib/api/generated/auth/auth";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Form fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // On mount or whenever user changes, populate the fields
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setUsername(user.username || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({
        email,
        username,
        password: currentPassword,
      });

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });

      // Optionally refetch user data or refresh
      router.refresh();
    } catch (error: any) {
      // If we catch an error, show that in a toast
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (name) {
      return name
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return username ? username.substring(0, 2).toUpperCase() : "U";
  };

  return (
    <div>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal information and how it appears to others.
        </p>
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* User avatar section */}
        <div className="md:w-1/3">
          <div className="flex flex-col items-center space-y-4">
            {/* <Avatar className="h-24 w-24">
              <AvatarImage src={user?.username} alt={name} />
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar> */}
            <div className="text-center">
              <h3 className="font-medium">{name || username}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>
        
        {/* Form section */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Display Name
                </div>
              </Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This is your public display name that other users will see.
              </p>
            </div>

            {/* USERNAME */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <AtSign className="h-4 w-4 text-muted-foreground" />
                  Username
                </div>
              </Label>
              <Input
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </div>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <Separator className="my-4" />

            {/* CURRENT PASSWORD FOR VERIFICATION */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter your current password to confirm these changes.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
