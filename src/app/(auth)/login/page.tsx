"use client";

import Link from "next/link";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import Image from "next/image";

export default function AuthenticationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-xl p-8 space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <Image
            src="/marzano-research-logo.png"
            alt="Marzano Research Logo"
            className="mx-auto mb-6"
            height={60}
            width={240}
          />
          <h2 className="text-3xl font-extrabold text-gray-800">Sign In</h2>
          <p className="text-sm text-gray-600 mt-2">
            Unlock your potential by signing into your account.
          </p>
        </div>

        {/* User Auth Form */}
        <UserAuthForm />

        {/* Forgot Password */}
        <div className="text-center mt-5">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Terms and Conditions */}
        <p className="mt-6 text-center text-xs text-gray-500 d-none">
          By signing in, you agree to our{" "}
          <Link
            href="#"
            className="font-medium text-primary-600 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="font-medium text-primary-600 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
