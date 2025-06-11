"use client";
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonStandingIcon } from 'lucide-react';
import React, { useEffect } from "react";
import { getApiAuthWhoami } from "@/lib/api/generated/default/default";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    document.title = "Login | EcoSys"
    getApiAuthWhoami().then(() => {
      router.push("/dashboard")
    }).catch(() => {});
  });
  
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <PersonStandingIcon className="mr-2 h-6 w-6" />
          EcoSys
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Enter your email below to sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}