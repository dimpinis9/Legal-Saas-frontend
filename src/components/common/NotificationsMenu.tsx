import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Circle,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../../api/notificationsApi";
import { useNavigate } from "react-router-dom";

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  DEADLINE_REMINDER: "⏰ Υπενθύμιση Προθεσμίας",
  HEARING_REMINDER: "⚖️ Υπενθύμιση Δικασίμου",
  TASK_ASSIGNED: "📋 Νέο Task",
  DOCUMENT_UPLOADED: "📄 Νέο Έγγραφο",
  CASE_UPDATE: "📁 Ενημέρωση Υπόθεσης",
  SYSTEM: "🔔 Σύστημα",
};

const NotificationsMenu: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.getNotifications(),
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: false,
    meta: {
      errorMessage: "Αποτυχία φόρτωσης ειδοποιήσεων",
    },
  });

  const unreadCountQuery = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000,
    retry: false,
    meta: {
      errorMessage: "Αποτυχία φόρτωσης μη αναγνωσμένων",
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationIds: number[]) =>
      notificationsApi.markAsRead({ notificationIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (!notification.isRead) {
      markAsReadMutation.mutate([notification.id]);
    }

    // Navigate to related case
    if (notification.relatedCaseId) {
      navigate(`/cases/${notification.relatedCaseId}`);
    }

    handleClose();
  };

  const notifications = Array.isArray(notificationsQuery.data)
    ? notificationsQuery.data
    : [];
  const unreadCount =
    typeof unreadCountQuery.data === "number" ? unreadCountQuery.data : 0;
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 },
        }}
      >
        <Box
          px={2}
          py={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Ειδοποιήσεις</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={() => markAllAsReadMutation.mutate()}>
              Όλα διαβασμένα
            </Button>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box py={3} textAlign="center">
            <Typography color="text.secondary">
              Δεν υπάρχουν ειδοποιήσεις
            </Typography>
          </Box>
        ) : (
          <>
            {unreadNotifications.length > 0 && (
              <>
                <Box px={2} py={1} bgcolor="#f5f5f5">
                  <Typography variant="caption" fontWeight="bold">
                    Αδιάβαστες
                  </Typography>
                </Box>
                {unreadNotifications.map((notification) => (
                  <MenuItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    sx={{ py: 1.5, bgcolor: "#e3f2fd" }}
                  >
                    <Circle
                      sx={{ fontSize: 8, color: "primary.main", mr: 1 }}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="bold">
                          {NOTIFICATION_TYPE_LABELS[notification.type] ||
                            notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.createdAt).toLocaleString(
                              "el-GR"
                            )}
                          </Typography>
                        </Box>
                      }
                    />
                  </MenuItem>
                ))}
              </>
            )}

            {notifications.filter((n) => n.isRead).length > 0 && (
              <>
                <Box px={2} py={1} bgcolor="#f5f5f5">
                  <Typography variant="caption" fontWeight="bold">
                    Διαβασμένες
                  </Typography>
                </Box>
                {notifications
                  .filter((n) => n.isRead)
                  .slice(0, 5)
                  .map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {NOTIFICATION_TYPE_LABELS[notification.type] ||
                              notification.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(notification.createdAt).toLocaleString(
                                "el-GR"
                              )}
                            </Typography>
                          </Box>
                        }
                      />
                    </MenuItem>
                  ))}
              </>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationsMenu;
