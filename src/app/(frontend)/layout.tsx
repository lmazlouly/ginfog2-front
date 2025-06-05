import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/frontend/layout/site-header";
import { SiteFooter } from "@/components/frontend/layout/site-footer";

export const metadata: Metadata = {
  title: "Teacher's Strategy Explorer | Teacher as Researcher Platform",
  description: "Explore evidence-based teaching strategies for your classroom",
};

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div 
        className="fixed inset-0 z-[-1] h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(to top, rgba(255, 255, 255, 0), rgb(239, 242, 245)), url("/bg.jpeg")',
          backgroundAttachment: 'fixed'
        }}
      />
      <div
        className="min-h-screen"
        // style={{
        //   backgroundImage: `linear-gradient(to top, rgba(255,255,255,0), rgb(239, 242, 245)), url(/bg.jpeg)`,
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        //   backgroundRepeat: 'no-repeat',
        // }}
      >
        <SiteHeader />
        {/* Main container for page content */}
        <main className="container mx-auto px-4 py-6 min-h-[calc(100vh-166px)]">{children}</main>
      </div>
      <SiteFooter />
    </div>

  );
}
