import React, { useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { casesApi } from "@api/casesApi";
import { clientsApi } from "@api/clientsApi";
import { deadlinesApi } from "@api/deadlinesApi";
import { tasksApi } from "@api/tasksApi";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import LoadingState from "@components/common/LoadingState";
import ErrorState from "@components/common/ErrorState";
import DocumentsTab from "@components/common/DocumentsTab";
import NotesTab from "@components/common/NotesTab";
import ActivityTimeline from "@components/common/ActivityTimeline";
import TabErrorBoundary from "@components/common/TabErrorBoundary";
import DeadlineDialog from "@components/dialogs/DeadlineDialog";
import TaskDialog from "@components/dialogs/TaskDialog";
import type { NewDeadlinePayload } from "../../types/deadline";
import type { NewTaskPayload } from "../../types/task";

const CaseDetailsPage: React.FC = () => {
  const { id } = useParams();
  const caseId = Number(id);
  const queryClient = useQueryClient();
  const [openDeadline, setOpenDeadline] = React.useState(false);
  const [openTask, setOpenTask] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  // Parallel queries for better performance
  const [caseQuery, deadlinesQuery, tasksQuery] = useQueries({
    queries: [
      {
        queryKey: ["case", caseId],
        queryFn: () => casesApi.getCase(caseId),
        enabled: !!caseId,
      },
      {
        queryKey: ["deadlines", { caseFileId: caseId }],
        queryFn: () => deadlinesApi.getDeadlines({ caseFileId: caseId }),
        enabled: !!caseId,
      },
      {
        queryKey: ["tasks", { caseFileId: caseId }],
        queryFn: () => tasksApi.getTasks({ caseFileId: caseId }),
        enabled: !!caseId,
      },
    ],
  });

  // Client query depends on caseQuery result
  const clientId = caseQuery.data?.clientId;
  const clientQuery = useQueries({
    queries: [
      {
        queryKey: ["client", clientId],
        queryFn: () => clientsApi.getClient(clientId!),
        enabled: !!clientId,
      },
    ],
  })[0];

  const createDeadlineMutation = useMutation({
    mutationFn: (payload: NewDeadlinePayload) =>
      deadlinesApi.createDeadline(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      setOpenDeadline(false);
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (payload: NewTaskPayload) => tasksApi.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setOpenTask(false);
    },
  });

  const completeDeadlineMutation = useMutation({
    mutationFn: (deadlineId: number) =>
      deadlinesApi.completeDeadline(deadlineId),
    // Optimistic update
    onMutate: async (deadlineId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["deadlines", { caseFileId: caseId }],
      });

      // Snapshot previous value
      const previousDeadlines = queryClient.getQueryData([
        "deadlines",
        { caseFileId: caseId },
      ]);

      // Optimistically update
      queryClient.setQueryData(
        ["deadlines", { caseFileId: caseId }],
        (old: any) =>
          old?.map((d: any) =>
            d.id === deadlineId ? { ...d, completed: true } : d
          )
      );

      return { previousDeadlines };
    },
    onError: (_err, _deadlineId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["deadlines", { caseFileId: caseId }],
        context?.previousDeadlines
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
    },
  });

  // Memoized handlers for better performance
  const handleTabChange = useCallback((_: unknown, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  const handleDeadlineSubmit = useCallback(
    (values: Omit<NewDeadlinePayload, "caseFileId">) => {
      createDeadlineMutation.mutate({ ...values, caseFileId: caseId });
    },
    [createDeadlineMutation, caseId]
  );

  const handleTaskSubmit = useCallback(
    (values: Omit<NewTaskPayload, "caseFileId">) => {
      createTaskMutation.mutate({ ...values, caseFileId: caseId });
    },
    [createTaskMutation, caseId]
  );

  const handleCompleteDeadline = useCallback(
    (deadlineId: number) => {
      completeDeadlineMutation.mutate(deadlineId);
    },
    [completeDeadlineMutation]
  );

  // Memoized computed values
  const isLoading = useMemo(
    () =>
      caseQuery.isLoading ||
      clientQuery.isLoading ||
      deadlinesQuery.isLoading ||
      tasksQuery.isLoading,
    [
      caseQuery.isLoading,
      clientQuery.isLoading,
      deadlinesQuery.isLoading,
      tasksQuery.isLoading,
    ]
  );

  const caseFile = useMemo(() => caseQuery.data, [caseQuery.data]);
  const client = useMemo(() => clientQuery.data, [clientQuery.data]);
  const deadlines = useMemo(
    () => deadlinesQuery.data || [],
    [deadlinesQuery.data]
  );
  const tasks = useMemo(() => tasksQuery.data || [], [tasksQuery.data]);

  if (isLoading) return <LoadingState />;
  if (caseQuery.isError) return <ErrorState message="Failed to load case" />;

  if (!caseFile) return <ErrorState message="Case not found" />;

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        {caseFile.title}
      </Typography>
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Typography variant="body2">
          <strong>Case Number:</strong> {caseFile.caseNumber}
        </Typography>
        <Typography variant="body2">
          <strong>Status:</strong> {caseFile.status}
        </Typography>
        <Typography variant="body2">
          <strong>Client:</strong>{" "}
          {client ? `${client.firstName} ${client.lastName}` : "Loading..."}
        </Typography>
        <Typography variant="body2">
          <strong>Court:</strong> {caseFile.court || "-"}
        </Typography>
        <Typography variant="body2">
          <strong>First Hearing:</strong>{" "}
          {caseFile.firstHearingDate
            ? new Date(caseFile.firstHearingDate).toLocaleDateString()
            : "-"}
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Deadlines & Tasks" />
          <Tab label="Έγγραφα" />
          <Tab label="Σημειώσεις" />
          <Tab label="Ιστορικό" />
        </Tabs>
      </Paper>

      {/* Tab 0: Deadlines & Tasks */}
      {activeTab === 0 && (
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h6">Deadlines</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setOpenDeadline(true)}
            >
              Add Deadline
            </Button>
          </Box>
          <Table size="small" sx={{ mb: 4 }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Completed</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deadlines.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.title}</TableCell>
                  <TableCell>{d.type}</TableCell>
                  <TableCell>
                    {new Date(d.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{d.completed ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {!d.completed && (
                      <Button
                        size="small"
                        onClick={() => handleCompleteDeadline(d.id)}
                      >
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {deadlines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>No deadlines.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h6">Tasks</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setOpenTask(true)}
            >
              Add Task
            </Button>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}
                  </TableCell>
                </TableRow>
              ))}
              {tasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>No tasks.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Tab 1: Documents */}
      {activeTab === 1 && (
        <TabErrorBoundary>
          <DocumentsTab caseFileId={caseId} />
        </TabErrorBoundary>
      )}

      {/* Tab 2: Notes */}
      {activeTab === 2 && (
        <TabErrorBoundary>
          <NotesTab caseFileId={caseId} />
        </TabErrorBoundary>
      )}

      {/* Tab 3: Activity Timeline */}
      {activeTab === 3 && (
        <TabErrorBoundary>
          <ActivityTimeline caseFileId={caseId} />
        </TabErrorBoundary>
      )}

      <DeadlineDialog
        open={openDeadline}
        onClose={() => setOpenDeadline(false)}
        onSubmit={handleDeadlineSubmit}
        disabled={createDeadlineMutation.isPending}
      />

      <TaskDialog
        open={openTask}
        onClose={() => setOpenTask(false)}
        onSubmit={handleTaskSubmit}
        disabled={createTaskMutation.isPending}
      />
    </Box>
  );
};

export default CaseDetailsPage;
