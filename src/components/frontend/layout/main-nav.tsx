import {
  NavigationMenu,
  // NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
// import { GetApiAuthWhoami200 as UserModel } from "@/lib/api/models";
import { useAuth } from "@/providers/auth-provider";

// Base navigation items for different user types
const getNavigationItems = (isAuthenticated: boolean, isSuperUser: boolean) => {
  const items = [];

  // Waste Entries - different routes for super users vs normal users
  if (isAuthenticated) {
    if (isSuperUser) {
      items.push({
        label: "Waste Entries",
        href: "/admin/waste-entries",
      });
    } else {
      items.push({
        label: "Waste Entries",
        href: "/client/waste-entries",
      });
      // Add Report Waste for client users
      items.push({
        label: "Report Waste",
        href: "/client/report-waste",
      });
    }
  }

  // Analytics - available to all users (authenticated and public)
  items.push({
    label: "Analytics",
    href: "/analytics",
  });

  // Reports - available to all users (authenticated and public)
  items.push({
    label: "Reports",
    href: "/reports",
  });

    

  return items;
};

export function MainNav() {
  const { isAuthenticated, isSuperUser } = useAuth();
  
  const navigationItems = getNavigationItems(isAuthenticated, isSuperUser);

  return (
    <>
    <NavigationMenu className="ml-auto hidden md:flex text-foreground right-10">
      <NavigationMenuList>
        { 
          navigationItems.map((item) => (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink href={item.href} className={navigationMenuTriggerStyle()} style={{ fontFamily: "Montserrat" }}>
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))
        }
      </NavigationMenuList>
    </NavigationMenu>
    </>
  );
}
