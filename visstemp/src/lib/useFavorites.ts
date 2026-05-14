"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readSession } from "@/app/(auth)/_components/auth-storage";
import {
  addFavoriteApi,
  fetchFavorites,
  removeFavoriteApi,
} from "@/lib/api/favorites";

/** Yêu thích khi chưa đăng nhập (chỉ trên thiết bị này). */
const GUEST_KEY = "visstemp_favorites";

function readGuestFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeGuestFavorites(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_KEY, JSON.stringify(ids));
}

type FavoritesState = {
  ids: string[];
  loading: boolean;
  error: string | null;
};

const favoritesStore: {
  state: FavoritesState;
  listeners: Set<(state: FavoritesState) => void>;
  activeSubscribers: number;
} = {
  state: { ids: [], loading: true, error: null },
  listeners: new Set(),
  activeSubscribers: 0,
};

function emitFavoritesState() {
  for (const listener of favoritesStore.listeners) listener(favoritesStore.state);
}

function setFavoritesState(next: Partial<FavoritesState>) {
  favoritesStore.state = { ...favoritesStore.state, ...next };
  emitFavoritesState();
}

async function refreshFavoritesStore() {
  const session = readSession();
  const hasToken = Boolean(session?.accessToken?.trim());
  setFavoritesState({ loading: true, error: null });
  try {
    if (hasToken) {
      const items = await fetchFavorites();
      setFavoritesState({
        ids: items.map((i) => i.id),
        loading: false,
        error: null,
      });
    } else {
      setFavoritesState({
        ids: readGuestFavorites(),
        loading: false,
        error: null,
      });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Lỗi tải yêu thích";
    if (hasToken) {
      setFavoritesState({ ids: [], loading: false, error: message });
    } else {
      setFavoritesState({
        ids: readGuestFavorites(),
        loading: false,
        error: null,
      });
    }
  }
}

async function toggleFavoriteStore(id: string) {
  const session = readSession();
  const hasToken = Boolean(session?.accessToken?.trim());
  setFavoritesState({ error: null });

  if (hasToken) {
    try {
      const currentlyHas = favoritesStore.state.ids.includes(id);
      const items = currentlyHas
        ? await removeFavoriteApi(id)
        : await addFavoriteApi(id);
      setFavoritesState({ ids: items.map((i) => i.id) });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Không cập nhật được yêu thích";
      setFavoritesState({ error: message });
    }
    return;
  }

  const next = new Set(favoritesStore.state.ids);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  const arr = Array.from(next);
  writeGuestFavorites(arr);
  setFavoritesState({ ids: arr });
}

export function useFavorites() {
  const [state, setState] = useState<FavoritesState>(favoritesStore.state);

  useEffect(() => {
    const listener = (next: FavoritesState) => setState(next);
    favoritesStore.listeners.add(listener);
    favoritesStore.activeSubscribers += 1;
    if (favoritesStore.activeSubscribers === 1) {
      void refreshFavoritesStore();
    }

    const onAuthChanged = () => {
      setFavoritesState({ ids: [], loading: true, error: null });
      void refreshFavoritesStore();
    };
    window.addEventListener("visstemp-auth-changed", onAuthChanged);
    return () => {
      favoritesStore.listeners.delete(listener);
      favoritesStore.activeSubscribers -= 1;
      window.removeEventListener("visstemp-auth-changed", onAuthChanged);
    };
  }, []);

  const set = useMemo(() => new Set(state.ids), [state.ids]);

  const toggle = useCallback((id: string) => {
    void toggleFavoriteStore(id);
  }, []);

  const has = useCallback((id: string) => set.has(id), [set]);

  return {
    ids: state.ids,
    has,
    toggle,
    loading: state.loading,
    error: state.error,
  };
}
