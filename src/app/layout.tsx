import type { Metadata, Viewport } from "next";
import { Montserrat, Sarabun } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster"
import { ConfirmationDialogProvider } from "@/providers/confirmation-dialog-provider";
// import icon from '../../public/marzazno-icon.png';

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const sarabun = Sarabun({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "Marzano",
  description: "Marzano Research - App for Teacher As a Researcher",
  icons: {
    icon: "/marzazno-icon.png",
  }
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${montserrat.variable} ${sarabun.variable} font-sans`}
      >
        <ConfirmationDialogProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
          </QueryProvider>
        </ConfirmationDialogProvider>
      </body>
    </html>
  );
}