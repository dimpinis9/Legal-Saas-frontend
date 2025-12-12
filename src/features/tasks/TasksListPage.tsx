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

const TasksListPage: React.FC = () => {
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
  if (tasksQuery.isError) return <ErrorState message="Failed to load tasks" />;

  const tasks = tasksQuery.data || [];
  const cases = casesQuery.data || [];

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Tasks
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Case</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((t) => {
            const caseFile = cases.find((c) => c.id === t.caseFileId);
            return (
              <TableRow key={t.id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{caseFile?.title || "-"}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={t.status}
                    onChange={(e) =>
                      updateStatusMutation.mutate({
                        id: t.id,
                        status: e.target.value as TaskStatus,
                      })
                    }
                  >
                    <MenuItem value="OPEN">OPEN</MenuItem>
                    <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
                    <MenuItem value="DONE">DONE</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}
                </TableCell>
              </TableRow>
            );
          })}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>No tasks.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TasksListPage;
