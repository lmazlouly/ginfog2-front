"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createContext, useContext, useState } from "react";

type DialogOptions = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmationContextType = {
  fire: (options: DialogOptions) => Promise<boolean>;
};

const ConfirmationContext = createContext<ConfirmationContextType | null>(null);

export function ConfirmationDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    title: "",
    description: "",
    confirmText: "Continue",
    cancelText: "Cancel",
  });
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>();

  const fire = (options: DialogOptions): Promise<boolean> => {
    setOptions({
      ...options,
      confirmText: options.confirmText || "Continue",
      cancelText: options.cancelText || "Cancel",
    });
    setOpen(true);

    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleClose = (confirmed: boolean) => {
    setOpen(false);
    resolvePromise?.(confirmed);
  };

  return (
    <ConfirmationContext.Provider value={{ fire }}>
      {children}
      <AlertDialog open={open} onOpenChange={(open) => !open && handleClose(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            <AlertDialogDescription>{options.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleClose(false)}>
              {options.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleClose(true)}>
              {options.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirmation must be used within a ConfirmationDialogProvider");
  }
  return context;
}