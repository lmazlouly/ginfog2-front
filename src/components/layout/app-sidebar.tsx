"use client";
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { 
  BarChart3,
  Book,
  Layers,
  Home,
  MapPin,
  Flag,
  GraduationCap,
  BookOpen,
  Target,
  ThumbsUp,
  Briefcase,
} from "lucide-react"

import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";

const navItems = [
  {
    category: "Geography Setup",
    role: 'super-admin',
    items: [
      { name: "States", href: "/dashboard/configs/states-management", icon: MapPin },
      { name: "Districts", href: "/dashboard/configs/districts-management", icon: Flag },
      { name: "Schools", href: "/dashboard/configs/schools-management", icon: Home },
    ],
  },
  {
    category: "Academic Structure",
    role: 'super-admin',
    items: [
      { name: "Grades", href: "/dashboard/configs/grades-management", icon: Layers },
      { name: "Content Areas", href: "/dashboard/configs/content-areas-management", icon: Book },
      { name: "Learning Standards", href: "/dashboard/configs/learning-standards-management", icon: BookOpen },
      { name: "Teaching Standards", href: "/dashboard/configs/teaching-standards-management", icon: GraduationCap },
    ],
  },
  {
    category: "Research & Evidence",
    role: 'super-admin',
    items: [
      { name: "Levels Of Evidence", href: "/dashboard/configs/levels-of-evidence-management", icon: BarChart3 },
      { name: "Recommendations", href: "/dashboard/configs/recommendations-management", icon: ThumbsUp },
    ],
  },
  {
    category: "Strategy Tools",
    role: 'super-admin',
    items: [
      { name: "Strategies", href: "/dashboard/configs/strategies-management", icon: Target },
    ],
  },
  {
    category: "Users Setup",
    role: 'super-admin',
    items: [
      { name: "Teachers Management", href: "/dashboard/users-setup/teachers-management", icon: Briefcase },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState(pathname);
  const { user, hasRole } = useAuth();

  useEffect(() => {
    setCurrentUrl(pathname);
  }, [pathname]);

  // const hasRole = (role: string | undefined) => {
  //   if ( !user ) return false;
  //   if ( !role ) return true;
  //   return user.role?.name === role;
  // }

  return ( user &&
    <Sidebar className="fixed top-0 left-0 h-screen w-60 bg-white dark:bg-gray-800 shadow-md flex flex-col" {...props}>
      <SidebarHeader className="flex items-center justify-center h-16 from-purple-600 to-indigo-500 pt-10">
        <Image 
          src="https://marzanoresearch.com/wp-content/uploads/2020/06/marzano-research-logo.png"
          alt="EcoSys Research Logo"
          width="200"
          height="50"
        />
      </SidebarHeader>

      <SidebarContent className="flex-1 p-4 overflow-y-auto mt-4">
        {navItems.map((category, index) => (
          !hasRole(category.role) ? null :
          <div key={index} className="mb-1">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">{category.category}</h2>
            <ul>
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex} className="mb-2">
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${item.href == currentUrl
                        ? "bg-primary text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white"
                      }`}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

