"use client";
import withRole from "@/components/auth/with-role";
import { AppSidebar } from "@/components/layout/app-sidebar";
import BreadcrumbNav from "@/components/layout/breadcrumb-nav";
import UserProfileMenu from "@/components/layout/user-profile-menu";
import LayoutProvider from "@/components/providers/layout-provider";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbProvider } from "@/contexts/breadcrumb-context";
import { useAuth } from "@/providers/auth-provider";

function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {user} = useAuth();
  
  return (
    <>
      { user &&
        <LayoutProvider>
          <SidebarProvider>
            <BreadcrumbProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center border-b px-3 justify-between">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <BreadcrumbNav />
                  </div>

                  <div className="mr-2">
                    <UserProfileMenu />
                  </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  {children}
                </div>
              </SidebarInset>
            </BreadcrumbProvider>
          </SidebarProvider>
        </LayoutProvider>
      }
    </>
  );
}

export default withRole(MainLayout, 'super-admin');
