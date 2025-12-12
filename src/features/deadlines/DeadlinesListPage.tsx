import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deadlinesApi } from "../../api/deadlinesApi";
import { casesApi } from "../../api/casesApi";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

const DeadlinesListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showCompleted, setShowCompleted] = React.useState(false);

  const deadlinesQuery = useQuery({
    queryKey: ["deadlines", { completed: showCompleted ? undefined : false }],
    queryFn: () =>
      deadlinesApi.getDeadlines(showCompleted ? {} : { completed: false }),
  });

  const casesQuery = useQuery({
    queryKey: ["cases"],
    queryFn: () => casesApi.getCases(),
  });

  const completeMutation = useMutation({
    mutationFn: (deadlineId: number) =>
      deadlinesApi.completeDeadline(deadlineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
    },
  });

  if (deadlinesQuery.isLoading || casesQuery.isLoading) return <LoadingState />;
  if (deadlinesQuery.isError)
    return <ErrorState message="Failed to load deadlines" />;

  const deadlines = deadlinesQuery.data || [];
  const cases = casesQuery.data || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Deadlines</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
            />
          }
          label="Show completed"
        />
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Case</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deadlines.map((d) => {
            const caseFile = cases.find((c) => c.id === d.caseFileId);
            return (
              <TableRow key={d.id}>
                <TableCell>{d.title}</TableCell>
                <TableCell>{caseFile?.title || "-"}</TableCell>
                <TableCell>{d.type}</TableCell>
                <TableCell>
                  {new Date(d.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{d.completed ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {!d.completed && (
                    <Button
                      size="small"
                      onClick={() => completeMutation.mutate(d.id)}
                      disabled={completeMutation.isPending}
                    >
                      Complete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {deadlines.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No deadlines.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default DeadlinesListPage;
