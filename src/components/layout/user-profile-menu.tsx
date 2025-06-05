"use client";
// import React from "react";
import Image from "next/image";
import { User, LogOut } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { logout } from "@/lib/api/generated/auth/auth";

export default function UserProfileMenu() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });

    location.href = "/login";
  };

  const handleProfile = () => {
    router.push("/dashboard/profile-settings");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* Avatar trigger */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12 border-2 border-gray-300">
            { user &&
              <Image
                className="aspect-square h-full w-full"
                alt={user.username as string}
                src={"https://ui-avatars.com/api/?color=inherit&background=random&name=" + user.username}
                width={40}
                height={40}
              />
            }
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        className="w-64 p-4 space-y-4 rounded-lg shadow-md bg-popover text-popover-foreground border border-border"
      >
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12 border-2 border-gray-300">
            { user &&
              <Image
                className="aspect-square h-full w-full"
                alt={user.username as string}
                src={"https://ui-avatars.com/api/?color=inherit&background=random&name=" + user.username}
                width={40}
                height={40}
              />
            }
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground">{user && user.username}</p>
            <p className="text-xs text-muted-foreground">{user && user.email}</p>
            <p className="text-xs text-muted-foreground">{user && user.is_superuser ? 'Superuser' : 'User'}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Menu Actions */}
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleProfile}
            className="flex items-center gap-2 justify-start"
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 justify-start"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
