import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheState {
  // State
  cache: Record<string, CacheEntry<any>>;

  // Actions
  set: <T>(key: string, data: T, ttl?: number) => void;
  get: <T>(key: string) => T | null;
  has: (key: string) => boolean;
  remove: (key: string) => void;
  clear: () => void;
  clearExpired: () => void;

  // Bulk operations
  setMany: <T>(entries: Array<{ key: string; data: T; ttl?: number }>) => void;
  removeMany: (keys: string[]) => void;

  // Query helpers
  getCacheSize: () => number;
  getCacheKeys: () => string[];
  getCacheStats: () => { total: number; expired: number; valid: number };
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export const useCacheStore = create<CacheState>()(
  devtools(
    immer((set, get) => ({
      cache: {},

      set: (key, data, ttl = DEFAULT_TTL) =>
        set((state) => {
          state.cache[key] = {
            data,
            timestamp: Date.now(),
            expiresAt: Date.now() + ttl,
          };
        }),

      get: (key) => {
        const entry = get().cache[key];
        if (!entry) return null;

        // Check if expired
        if (Date.now() > entry.expiresAt) {
          get().remove(key);
          return null;
        }

        return entry.data;
      },

      has: (key) => {
        const entry = get().cache[key];
        if (!entry) return false;

        // Check if expired
        if (Date.now() > entry.expiresAt) {
          get().remove(key);
          return false;
        }

        return true;
      },

      remove: (key) =>
        set((state) => {
          delete state.cache[key];
        }),

      clear: () =>
        set((state) => {
          state.cache = {};
        }),

      clearExpired: () =>
        set((state) => {
          const now = Date.now();
          Object.keys(state.cache).forEach((key) => {
            if (now > state.cache[key].expiresAt) {
              delete state.cache[key];
            }
          });
        }),

      setMany: (entries) =>
        set((state) => {
          entries.forEach(({ key, data, ttl = DEFAULT_TTL }) => {
            state.cache[key] = {
              data,
              timestamp: Date.now(),
              expiresAt: Date.now() + ttl,
            };
          });
        }),

      removeMany: (keys) =>
        set((state) => {
          keys.forEach((key) => {
            delete state.cache[key];
          });
        }),

      getCacheSize: () => Object.keys(get().cache).length,

      getCacheKeys: () => Object.keys(get().cache),

      getCacheStats: () => {
        const { cache } = get();
        const now = Date.now();
        const keys = Object.keys(cache);
        const expired = keys.filter((key) => now > cache[key].expiresAt).length;

        return {
          total: keys.length,
          expired,
          valid: keys.length - expired,
        };
      },
    })),
    { name: "Cache Store" }
  )
);

// Auto cleanup expired cache every 5 minutes
if (typeof window !== "undefined") {
  setInterval(() => {
    useCacheStore.getState().clearExpired();
  }, 5 * 60 * 1000);
}
