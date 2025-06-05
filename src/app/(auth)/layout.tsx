'use client';
import isGuest from "@/components/auth/is-guest"

function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

export default isGuest(AuthLayout);