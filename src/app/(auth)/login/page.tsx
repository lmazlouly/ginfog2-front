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
        <div className="flex items-center gap-3 justify-center" >
          <Link href="/" className="flex items-center gap-2">
            <div className="text-green-600 w-8 h-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.86 9.03c-.4-.9-1.3-1.5-2.3-1.6h-.8C18.46 5.13 16.36 3 13.56 3c-2.5 0-4.6 1.9-4.9 4.4-1.5.3-2.7 1.5-3 3-.9.1-1.6.6-2 1.4-.5.8-.5 1.8-.1 2.6.4.9 1.3 1.5 2.3 1.6h13.2c1 0 2-.5 2.6-1.4.6-.9.7-1.9.2-2.9v-2.7zM7.76 15h-1.5c-.4 0-.8-.3-1-.7-.2-.4-.1-.8.1-1.2.2-.3.6-.6 1-.6v-.5c.2-1.1 1.2-1.9 2.3-1.9.4-3.7 8.6-3.7 9.1.3 1.3-.2 2.5.7 2.7 1.9.1.5 0 .9-.2 1.3-.2.4-.5.7-.9.7h-11.6z"/>
                <path d="M18.26 15.7c-3.2 2.7-8.4 2.3-11.2-.7-2.1-2.2-2.6-5.3-1.5-7.9l1 .3c-1 2.3-.5 5.1 1.3 7 2.4 2.6 7 2.8 9.6.6.3-.2.5-.5.8-.7l.8.7c-.3.2-.5.5-.8.7z"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-green-800">EcoSys</span>
          </Link>
        </div>

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
            Forgot your password? <br />
            <Link href="/register" className="text-sm font-medium text-primary-600 hover:underline">
             don´t have account  Register here ?
            </Link>
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
