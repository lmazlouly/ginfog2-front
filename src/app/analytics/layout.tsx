"use client";
import LayoutProvider from "@/components/providers/layout-provider";
import { BreadcrumbProvider } from "@/contexts/breadcrumb-context";

function AnalyticsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <LayoutProvider>
        <BreadcrumbProvider>
          {children}
        </BreadcrumbProvider>
      </LayoutProvider>
    </>
  );
}

export default AnalyticsLayout;
