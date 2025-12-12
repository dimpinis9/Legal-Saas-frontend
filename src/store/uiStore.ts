import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Notifications
  unreadNotificationsCount: number;
  setUnreadNotificationsCount: (count: number) => void;

  // Search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Quick Actions
  quickAddOpen: boolean;
  setQuickAddOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Theme
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // Notifications
      unreadNotificationsCount: 0,
      setUnreadNotificationsCount: (count) =>
        set({ unreadNotificationsCount: count }),

      // Search
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),

      // Quick Actions
      quickAddOpen: false,
      setQuickAddOpen: (open) => set({ quickAddOpen: open }),
    }),
    {
      name: "ui-storage", // localStorage key
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        darkMode: state.darkMode,
      }), // Only persist sidebar and theme
    }
  )
);
