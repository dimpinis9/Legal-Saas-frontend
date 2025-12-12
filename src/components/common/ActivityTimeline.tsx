import React from "react";
import { Box, Typography, Paper, Stack, Avatar } from "@mui/material";
import {
  FolderOpen,
  Gavel,
  CheckCircle,
  Task,
  Description,
  Note,
  Person,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { activitiesApi } from "../../api/activitiesApi";
import type { ActivityType } from "../../types/activity";
import LoadingState from "./LoadingState";

interface ActivityTimelineProps {
  caseFileId: number;
}

const ACTIVITY_ICONS: Record<ActivityType, React.ReactElement> = {
  CASE_CREATED: <FolderOpen />,
  CASE_UPDATED: <FolderOpen />,
  DEADLINE_ADDED: <Gavel />,
  DEADLINE_COMPLETED: <CheckCircle />,
  TASK_ADDED: <Task />,
  TASK_COMPLETED: <CheckCircle />,
  DOCUMENT_UPLOADED: <Description />,
  NOTE_ADDED: <Note />,
  CLIENT_ASSIGNED: <Person />,
};

const ACTIVITY_COLORS: Record<
  ActivityType,
  "primary" | "success" | "info" | "warning"
> = {
  CASE_CREATED: "primary",
  CASE_UPDATED: "info",
  DEADLINE_ADDED: "warning",
  DEADLINE_COMPLETED: "success",
  TASK_ADDED: "info",
  TASK_COMPLETED: "success",
  DOCUMENT_UPLOADED: "primary",
  NOTE_ADDED: "info",
  CLIENT_ASSIGNED: "primary",
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ caseFileId }) => {
  const activitiesQuery = useQuery({
    queryKey: ["activities", { caseFileId }],
    queryFn: () => activitiesApi.getActivities({ caseFileId, limit: 50 }),
  });

  if (activitiesQuery.isLoading) return <LoadingState />;

  const activities = activitiesQuery.data || [];

  if (activities.length === 0) {
    return (
      <Box py={4} textAlign="center">
        <Typography color="text.secondary">
          Δεν υπάρχει ιστορικό ενεργειών
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Ιστορικό Ενεργειών
      </Typography>
      <Stack spacing={2}>
        {activities.map((activity) => (
          <Paper key={activity.id} sx={{ p: 2, display: "flex", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: `${ACTIVITY_COLORS[activity.type]}.main`,
                width: 40,
                height: 40,
              }}
            >
              {ACTIVITY_ICONS[activity.type]}
            </Avatar>
            <Box flex={1}>
              <Typography variant="body1" fontWeight="bold">
                {activity.description}
              </Typography>
              {activity.userName && (
                <Typography variant="body2" color="text.secondary">
                  από {activity.userName}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {new Date(activity.createdAt).toLocaleDateString("el-GR")} •{" "}
                {new Date(activity.createdAt).toLocaleTimeString("el-GR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default ActivityTimeline;
