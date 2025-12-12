import { apiClient } from "./apiClient";
import type { Notification, MarkAsReadPayload } from "../types/notification";

export const notificationsApi = {
  getNotifications: async (params?: {
    unreadOnly?: boolean;
  }): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>("/notifications", {
      params,
    });
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<{ count: number }>(
      "/notifications/unread-count"
    );
    return response.data.count;
  },

  markAsRead: async (payload: MarkAsReadPayload): Promise<void> => {
    await apiClient.post("/notifications/mark-read", payload);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.post("/notifications/mark-all-read");
  },

  deleteNotification: async (id: number): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },
};

