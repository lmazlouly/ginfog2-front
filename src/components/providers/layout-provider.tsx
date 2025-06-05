"use client";
import React from "react";
import ThemeProvider from "./theme-provider";
import Next13ProgressBar from "next13-progressbar";
import { NextUIProvider } from "@nextui-org/system";

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextUIProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Next13ProgressBar
            height="4px"
            options={{ showSpinner: false }}
            color="#6E8CBE"
            showOnShallow
          />
        </ThemeProvider>
      </NextUIProvider>
    </>
  );
}