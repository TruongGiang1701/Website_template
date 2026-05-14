"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteGuestCartItem,
  fetchGuestCart,
  upsertGuestCartItem,
} from "@/lib/api/cart";

export type CartLine = {
  id: string;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  loading: boolean;
  syncError: string | null;
};

const cartStore: {
  state: CartState;
  listeners: Set<(state: CartState) => void>;
  /** Số component đang subscribe; 0→1 cần fetch lại (ví dụ vừa rời /login quay lại trang có Navbar). */
  activeSubscribers: number;
} = {
  state: { lines: [], loading: true, syncError: null },
  listeners: new Set(),
  activeSubscribers: 0,
};

function emitCartState() {
  for (const listener of cartStore.listeners) listener(cartStore.state);
}

function setCartState(next: Partial<CartState>) {
  cartStore.state = { ...cartStore.state, ...next };
  emitCartState();
}

async function refreshCartStore() {
  try {
    setCartState({ syncError: null });
    const data = await fetchGuestCart();
    setCartState({ lines: data.lines });
  } catch (e) {
    setCartState({
      syncError: e instanceof Error ? e.message : "Lỗi đồng bộ giỏ hàng",
      lines: [],
    });
  } finally {
    setCartState({ loading: false });
  }
}

async function addToCartStore(id: string, qty = 1) {
  const n = Math.max(1, Math.floor(qty));
  const current = cartStore.state.lines.find((l) => l.id === id)?.qty ?? 0;
  const newQty = Math.min(99, current + n);
  setCartState({ syncError: null });
  try {
    const data = await upsertGuestCartItem(id, newQty);
    setCartState({ lines: data.lines });
  } catch (e) {
    setCartState({
      syncError: e instanceof Error ? e.message : "Không cập nhật được giỏ hàng",
    });
  }
}

async function removeFromCartStore(id: string) {
  setCartState({ syncError: null });
  try {
    const data = await deleteGuestCartItem(id);
    setCartState({ lines: data.lines });
  } catch (e) {
    setCartState({
      syncError: e instanceof Error ? e.message : "Không cập nhật được giỏ hàng",
    });
  }
}

async function clearCartStore(lines: CartLine[]) {
  if (lines.length === 0) return;
  setCartState({ syncError: null });
  let data: Awaited<ReturnType<typeof deleteGuestCartItem>> | null = null;
  try {
    for (const id of lines.map((l) => l.id)) {
      data = await deleteGuestCartItem(id);
    }
    setCartState({ lines: data?.lines ?? [] });
  } catch (e) {
    setCartState({
      syncError: e instanceof Error ? e.message : "Không cập nhật được giỏ hàng",
    });
  }
}

export function useCart() {
  const [state, setState] = useState<CartState>(cartStore.state);

  useEffect(() => {
    const listener = (next: CartState) => setState(next);
    cartStore.listeners.add(listener);
    cartStore.activeSubscribers += 1;
    if (cartStore.activeSubscribers === 1) {
      void refreshCartStore();
    }

    const onAuthChanged = () => {
      // Đổi tài khoản / logout: không giữ snapshot giỏ cũ trên UI (tránh hiển thị sai user).
      setCartState({ lines: [], loading: true, syncError: null });
      void refreshCartStore();
    };
    window.addEventListener("visstemp-auth-changed", onAuthChanged);
    return () => {
      cartStore.listeners.delete(listener);
      cartStore.activeSubscribers -= 1;
      window.removeEventListener("visstemp-auth-changed", onAuthChanged);
    };
  }, []);

  const count = useMemo(
    () =>
      state.lines.reduce((sum, line) => sum + (Number.isFinite(line.qty) ? line.qty : 0), 0),
    [state.lines],
  );

  const add = useCallback((id: string, qty = 1) => addToCartStore(id, qty), []);
  const remove = useCallback((id: string) => removeFromCartStore(id), []);
  const clear = useCallback(() => clearCartStore(state.lines), [state.lines]);
  const refresh = useCallback(() => refreshCartStore(), []);

  return {
    lines: state.lines,
    count,
    add,
    remove,
    clear,
    refresh,
    loading: state.loading,
    syncError: state.syncError,
  };
}
