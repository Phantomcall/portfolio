import { useSyncExternalStore } from "react";
import type { Currency } from "@/lib/rates";

const STORAGE_KEY = "currency";

// The visitor's currency choice, shared by every price on the page and remembered in
// localStorage. Storage can throw (private mode, blocked site data), so an in-memory
// copy backs it up.
let memoryCurrency: Currency = "USD";
const listeners = new Set<() => void>();

function readCurrency(): Currency {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "USD" || saved === "NGN") return saved;
  } catch {}
  return memoryCurrency;
}

export function setCurrency(next: Currency) {
  memoryCurrency = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {}
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
}

export function useCurrency() {
  return useSyncExternalStore(subscribe, readCurrency, () => "USD" as Currency);
}
