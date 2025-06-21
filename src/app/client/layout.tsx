"use client";
import withAuth from "@/components/auth/with-auth";
import { SiteHeader } from "@/components/frontend/layout/site-header";
import LayoutProvider from "@/components/providers/layout-provider";
import { BreadcrumbProvider } from "@/contexts/breadcrumb-context";
import { useAuth } from "@/providers/auth-provider";

function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();

  return (
    <>
      <LayoutProvider>
        <BreadcrumbProvider>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-6">
            {children}
          </div>
        </BreadcrumbProvider>
      </LayoutProvider>
    </>
  );
}

export default withAuth(MainLayout);
