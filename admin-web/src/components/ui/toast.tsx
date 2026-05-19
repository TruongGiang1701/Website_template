"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg border animate-in slide-in-from-right-full duration-300",
              t.type === "success" && "bg-emerald-50 border-emerald-100 text-emerald-800",
              t.type === "error" && "bg-rose-50 border-rose-100 text-rose-800",
              t.type === "info" && "bg-blue-50 border-blue-100 text-blue-800",
              t.type === "warning" && "bg-amber-50 border-amber-100 text-amber-800"
            )}
          >
            {t.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-500" />}
            {t.type === "error" && <AlertCircle className="h-5 w-5 text-rose-500" />}
            {t.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
            {t.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
            
            <span className="text-sm font-medium">{t.message}</span>
            
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
