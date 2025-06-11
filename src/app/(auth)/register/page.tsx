"use client";

import { register } from "@/lib/api/generated/auth/auth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!form.password) newErrors.password = "Password is required.";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      // TODO: Integrate with backend registration logic here
      register({
        email: form.email,
        username: form.name,
        password: form.password,
        is_active: true,
      }).then((user) => {
        alert("Registration successful!");
        router.push("login");
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              className={`mt-1 w-full rounded border px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              className={`mt-1 w-full rounded border px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              className={`mt-1 w-full rounded border px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className={`mt-1 w-full rounded border px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="w-full rounded bg-primary px-4 py-2 font-semibold text-white shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
        {submitted && (
          <p className="mt-4 text-center text-green-600">Registration successful! (This is a placeholder message.)</p>
        )}
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account?</span>
          <a
            href="/auth/login"
            className="ml-2 inline-block rounded bg-gray-100 px-4 py-2 text-primary-600 font-semibold shadow hover:bg-primary-50 hover:text-primary-900 transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
