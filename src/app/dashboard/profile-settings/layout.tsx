"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Lock, Bell, Settings } from "lucide-react";

export default function ProfileSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { 
      href: "/dashboard/profile-settings", 
      label: "Profile", 
      icon: <UserCircle className="mr-2 h-4 w-4" /> 
    },
    { 
      href: "/dashboard/profile-settings/change-password", 
      label: "Password", 
      icon: <Lock className="mr-2 h-4 w-4" /> 
    },
    // Uncomment if you have these sections or add your own
    // { 
    //   href: "/dashboard/profile-settings/notifications", 
    //   label: "Notifications", 
    //   icon: <Bell className="mr-2 h-4 w-4" /> 
    // },
    // { 
    //   href: "/dashboard/profile-settings/preferences", 
    //   label: "Preferences", 
    //   icon: <Settings className="mr-2 h-4 w-4" /> 
    // },
  ];

  // Helper to highlight the active link
  function linkClasses(href: string) {
    const isActive = pathname === href;
    return `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;
  }

  return (
    <div className="container py-8 max-w-6xl">
      {/* Top heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Separator className="my-6" />

      {/* Main content area with sidebar and content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT SIDE - NAVIGATION */}
        <aside className="md:w-1/4 mb-8 md:mb-0">
          <Card className="sticky top-8">
            <nav className="p-2">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className={linkClasses(item.href)}>
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </Card>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="flex-1">
          <Card className="p-6">
            {children}
          </Card>
        </main>
      </div>
    </div>
  );
}
