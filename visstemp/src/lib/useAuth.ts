"use client";

import { useEffect, useMemo, useState } from "react";
import {
  logoutLocalUser,
  readSession,
  readUserSettings,
  type LocalSession,
  type UserSettings,
} from "@/app/(auth)/_components/auth-storage";

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "V";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function useAuth() {
  const [session, setSession] = useState<LocalSession | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    const sync = () => {
      const nextSession = readSession();
      setSession(nextSession);
      setSettings(nextSession ? readUserSettings(nextSession.email) : null);
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("visstemp-auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("visstemp-auth-changed", sync);
    };
  }, []);

  const user = useMemo(() => {
    if (!session) return null;
    const displayName = settings?.displayName?.trim() || session.name;
    return {
      email: session.email,
      name: displayName,
      initials: initialsFromName(displayName),
      settings,
    };
  }, [session, settings]);

  return {
    user,
    isAuthenticated: Boolean(user),
    logout: logoutLocalUser,
  };
}
