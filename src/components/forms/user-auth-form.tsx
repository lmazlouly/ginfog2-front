"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { login, getMe } from "@/lib/api/generated/auth/auth";
import { User } from "@/lib/api/models";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export function UserAuthForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: UserFormValue) => {
    setLoading(true);
    login({
      username: data.username,
      password: data.password,
    }).then((_token) => {
      // After successful login, fetch user details
      return getMe();
    }).then((user: User) => {
      toast({
        variant: "default",
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      // Determine redirect path based on user role
      const redirectPath = user.is_superuser ? "/dashboard" : "/";
      router.push(redirectPath);
    }).catch((error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }).finally(() => {
      setLoading(false);
    })
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="yourusername"
                  disabled={loading}
                  {...field}
                  className="focus:ring-2 focus:ring-primary-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={loading}
                    {...field}
                    className="focus:ring-2 focus:ring-primary-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={loading}
          className="w-full bg-primary-900 text-white hover:bg-primary"
          type="submit"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </Form>
  );
}
