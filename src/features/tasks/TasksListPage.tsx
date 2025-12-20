import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../../api/tasksApi";
import { casesApi } from "../../api/casesApi";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import type { TaskStatus } from "../../types/task";
import { useTranslation } from "react-i18next";

const TasksListPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksApi.getTasks(),
  });

  const casesQuery = useQuery({
    queryKey: ["cases"],
    queryFn: () => casesApi.getCases(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TaskStatus }) =>
      tasksApi.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  if (tasksQuery.isLoading || casesQuery.isLoading) return <LoadingState />;
  if (tasksQuery.isError) return <ErrorState message={t("errors.generic")} />;

  const tasks = tasksQuery.data || [];
  const cases = casesQuery.data || [];

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        {t("tasks.title")}
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("common.title")}</TableCell>
            <TableCell>{t("cases.title")}</TableCell>
            <TableCell>{t("common.status")}</TableCell>
            <TableCell>{t("tasks.dueDate")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => {
            const caseFile = cases.find((c) => c.id === task.caseFileId);
            return (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{caseFile?.title || "-"}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={task.status}
                    onChange={(e) =>
                      updateStatusMutation.mutate({
                        id: task.id,
                        status: e.target.value as TaskStatus,
                      })
                    }
                  >
                    <MenuItem value="OPEN">
                      {t("tasks.statuses.pending")}
                    </MenuItem>
                    <MenuItem value="IN_PROGRESS">
                      {t("tasks.statuses.inProgress")}
                    </MenuItem>
                    <MenuItem value="DONE">
                      {t("tasks.statuses.completed")}
                    </MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "-"}
                </TableCell>
              </TableRow>
            );
          })}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>{t("tasks.noTasks")}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TasksListPage;
