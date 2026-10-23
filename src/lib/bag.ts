"use client";

import { useSyncExternalStore } from "react";

/**
 * The shopping bag. There is no backend, so it lives in localStorage on the
 * visitor's phone and is sent to the shop as one WhatsApp message.
 */

export interface BagItem {
  slug: string;
  size: string | null;
  colour: string | null;
  qty: number;
}

interface BagState {
  items: BagItem[];
  open: boolean;
}

const KEY = "mob-bag";
const EMPTY: BagState = { items: [], open: false };

let state: BagState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(saved)) state = { ...state, items: saved };
  } catch {
    /* Private mode or bad data — start with an empty bag. */
  }
}

function set(next: Partial<BagState>) {
  state = { ...state, ...next };
  if (next.items) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state.items));
    } catch {
      /* Storage full or blocked — the bag still works for this visit. */
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return state;
}

const getServerSnapshot = () => EMPTY;

export function useBag(): BagState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const same = (a: BagItem, b: Omit<BagItem, "qty">) =>
  a.slug === b.slug && a.size === b.size && a.colour === b.colour;

/** Adds a piece, or one more of it if the same size and colour is in already. */
export function addToBag(item: Omit<BagItem, "qty">) {
  load();
  const existing = state.items.find((i) => same(i, item));
  const items = existing
    ? state.items.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i))
    : [...state.items, { ...item, qty: 1 }];
  set({ items, open: true });
}

export function setQty(index: number, qty: number) {
  set({
    items:
      qty <= 0
        ? state.items.filter((_, i) => i !== index)
        : state.items.map((item, i) => (i === index ? { ...item, qty } : item)),
  });
}

export function clearBag() {
  set({ items: [] });
}

export function setBagOpen(open: boolean) {
  set({ open });
}

export function bagCount(items: BagItem[]): number {
  return items.reduce((total, item) => total + item.qty, 0);
}
