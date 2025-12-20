import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "LAWYER" | "ASSISTANT";
  avatar?: string;
}

export interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  lastLoginAt: Date | null;
  sessionExpiry: Date | null;

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  refreshSession: () => void;

  // Computed
  isSessionExpired: () => boolean;
  getUserDisplayName: () => string;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        lastLoginAt: null,
        sessionExpiry: null,

        // Actions
        setAuth: (user, accessToken, refreshToken) =>
          set((state) => {
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken || null;
            state.isAuthenticated = true;
            state.lastLoginAt = new Date();
            // Set session expiry to 24 hours from now
            state.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
          }),

        updateUser: (userData) =>
          set((state) => {
            if (state.user) {
              state.user = { ...state.user, ...userData };
            }
          }),

        clearAuth: () =>
          set((state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.lastLoginAt = null;
            state.sessionExpiry = null;
          }),

        setTokens: (accessToken, refreshToken) =>
          set((state) => {
            state.accessToken = accessToken;
            if (refreshToken) {
              state.refreshToken = refreshToken;
            }
            // Extend session expiry
            state.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
          }),

        refreshSession: () =>
          set((state) => {
            state.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
          }),

        // Computed getters
        isSessionExpired: () => {
          const { sessionExpiry } = get();
          if (!sessionExpiry) return true;
          return new Date() > new Date(sessionExpiry);
        },

        getUserDisplayName: () => {
          const { user } = get();
          if (!user) return "Guest";
          return `${user.firstName} ${user.lastName}`;
        },
      })),
      {
        name: "legal-saas-auth-storage",
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
          lastLoginAt: state.lastLoginAt,
          sessionExpiry: state.sessionExpiry,
        }),
      }
    ),
    { name: "Auth Store" }
  )
);
