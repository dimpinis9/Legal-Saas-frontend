import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Theme
  darkMode: boolean;

  // Notifications
  unreadNotificationsCount: number;
  notificationsPanelOpen: boolean;

  // Search
  searchOpen: boolean;
  searchHistory: string[];

  // Quick Actions
  quickAddOpen: boolean;
  quickAddType: "case" | "client" | "deadline" | "task" | null;

  // Loading states
  globalLoading: boolean;
  loadingMessage: string;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;

  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;

  setUnreadNotificationsCount: (count: number) => void;
  toggleNotificationsPanel: () => void;

  setSearchOpen: (open: boolean) => void;
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;

  setQuickAddOpen: (open: boolean, type?: UIState["quickAddType"]) => void;

  setGlobalLoading: (loading: boolean, message?: string) => void;

  // Bulk actions
  resetUI: () => void;
}

const initialState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  darkMode: false,
  unreadNotificationsCount: 0,
  notificationsPanelOpen: false,
  searchOpen: false,
  searchHistory: [],
  quickAddOpen: false,
  quickAddType: null,
  globalLoading: false,
  loadingMessage: "",
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // Sidebar actions
        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          }),

        setSidebarOpen: (open) =>
          set((state) => {
            state.sidebarOpen = open;
          }),

        toggleSidebarCollapse: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),

        // Theme actions
        toggleDarkMode: () =>
          set((state) => {
            state.darkMode = !state.darkMode;
          }),

        setDarkMode: (enabled) =>
          set((state) => {
            state.darkMode = enabled;
          }),

        // Notifications actions
        setUnreadNotificationsCount: (count) =>
          set((state) => {
            state.unreadNotificationsCount = count;
          }),

        toggleNotificationsPanel: () =>
          set((state) => {
            state.notificationsPanelOpen = !state.notificationsPanelOpen;
          }),

        // Search actions
        setSearchOpen: (open) =>
          set((state) => {
            state.searchOpen = open;
          }),

        addSearchHistory: (query) =>
          set((state) => {
            if (query && !state.searchHistory.includes(query)) {
              state.searchHistory = [query, ...state.searchHistory].slice(
                0,
                10
              );
            }
          }),

        clearSearchHistory: () =>
          set((state) => {
            state.searchHistory = [];
          }),

        // Quick actions
        setQuickAddOpen: (open, type = null) =>
          set((state) => {
            state.quickAddOpen = open;
            state.quickAddType = type;
          }),

        // Loading
        setGlobalLoading: (loading, message = "") =>
          set((state) => {
            state.globalLoading = loading;
            state.loadingMessage = message;
          }),

        // Reset
        resetUI: () =>
          set(() => ({
            ...initialState,
          })),
      })),
      {
        name: "legal-saas-ui-storage",
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          sidebarCollapsed: state.sidebarCollapsed,
          darkMode: state.darkMode,
          searchHistory: state.searchHistory,
        }),
      }
    ),
    { name: "UI Store" }
  )
);
