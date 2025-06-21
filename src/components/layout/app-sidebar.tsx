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
  // {
  //   category: "Geography Setup",
  //   role: 'super-admin',
  //   items: [
  //     { name: "States", href: "/dashboard/configs/states-management", icon: MapPin },
  //     { name: "Districts", href: "/dashboard/configs/districts-management", icon: Flag },
  //     { name: "Schools", href: "/dashboard/configs/schools-management", icon: Home },
  //   ],
  // },
  // {
  //   category: "Academic Structure",
  //   role: 'super-admin',
  //   items: [
  //     { name: "Grades", href: "/dashboard/configs/grades-management", icon: Layers },
  //     { name: "Content Areas", href: "/dashboard/configs/content-areas-management", icon: Book },
  //     { name: "Learning Standards", href: "/dashboard/configs/learning-standards-management", icon: BookOpen },
  //     { name: "Teaching Standards", href: "/dashboard/configs/teaching-standards-management", icon: GraduationCap },
  //   ],
  // },
  // {
  //   category: "Research & Evidence",
  //   role: 'super-admin',
  //   items: [
  //     { name: "Levels Of Evidence", href: "/dashboard/configs/levels-of-evidence-management", icon: BarChart3 },
  //     { name: "Recommendations", href: "/dashboard/configs/recommendations-management", icon: ThumbsUp },
  //   ],
  // },
  // {
  //   category: "Strategy Tools",
  //   role: 'super-admin',
  //   items: [
  //     { name: "Strategies", href: "/dashboard/configs/strategies-management", icon: Target },
  //   ],
  // },
  // {
  //   category: "Users Setup",
  //   role: 'super-admin',
  //   items: [
  //     { name: "Teachers Management", href: "/dashboard/users-setup/teachers-management", icon: Briefcase },
  //   ],
  // },
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
      <div className="flex items-center gap-3 justify-center" >
            <Link href="/" className="flex items-center gap-2">
              <div className="text-green-600 w-8 h-8" >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.86 9.03c-.4-.9-1.3-1.5-2.3-1.6h-.8C18.46 5.13 16.36 3 13.56 3c-2.5 0-4.6 1.9-4.9 4.4-1.5.3-2.7 1.5-3 3-.9.1-1.6.6-2 1.4-.5.8-.5 1.8-.1 2.6.4.9 1.3 1.5 2.3 1.6h13.2c1 0 2-.5 2.6-1.4.6-.9.7-1.9.2-2.9v-2.7zM7.76 15h-1.5c-.4 0-.8-.3-1-.7-.2-.4-.1-.8.1-1.2.2-.3.6-.6 1-.6v-.5c.2-1.1 1.2-1.9 2.3-1.9.4-3.7 8.6-3.7 9.1.3 1.3-.2 2.5.7 2.7 1.9.1.5 0 .9-.2 1.3-.2.4-.5.7-.9.7h-11.6z" />
                  <path d="M18.26 15.7c-3.2 2.7-8.4 2.3-11.2-.7-2.1-2.2-2.6-5.3-1.5-7.9l1 .3c-1 2.3-.5 5.1 1.3 7 2.4 2.6 7 2.8 9.6.6.3-.2.5-.5.8-.7l.8.7c-.3.2-.5.5-.8.7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-green-800">EcoSys</span>
            </Link>
          </div>
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

