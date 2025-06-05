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

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    role: "super-admin",
  },
  {
    label: "Waste Entries",
    href: "/waste-entries",
    // For all users
  },
  {
    label: "Analytics",
    href: "/analytics",
    // For all users
  },
  {
    label: "Reports",
    href: "/reports",
    // For all users
  },
  {
    label: "Recycling Centers",
    href: "/recycling-centers",
    // For all users
  },
  {
    label: "Admin Panel",
    href: "/admin",
    role: "super-admin",
  },
];

export function MainNav() {
  const { hasRole } = useAuth();
  // const roleName = user ? user.role.name : undefined;

  // const hasRole = (role: string | undefined) => {
  //   if ( !role ) return true;
  //   return roleName === role;
  // }
  return (
    <>
    <NavigationMenu className="ml-auto hidden md:flex text-foreground right-10">
      <NavigationMenuList>
        { 
          navigationItems.map((item) => {
            return (
              !hasRole(item.role) ? null :
              <NavigationMenuItem key={item.href}>
                {/* <Link href={item.href} passHref> */}
                  <NavigationMenuLink href={item.href} className={navigationMenuTriggerStyle()} style={{ fontFamily: "Montserrat" }}>
                    {item.label}
                  </NavigationMenuLink>
                {/* </Link> */}
              </NavigationMenuItem>
            )
          })
        }
      </NavigationMenuList>
    </NavigationMenu>
    </>
  );
}
