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
import { useTranslation } from "react-i18next";

const DeadlinesListPage: React.FC = () => {
  const { t } = useTranslation();
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
    return <ErrorState message={t("errors.generic")} />;

  const deadlines = deadlinesQuery.data || [];
  const cases = casesQuery.data || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">{t("deadlines.title")}</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
            />
          }
          label={t("deadlines.showCompleted") || "Show completed"}
        />
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("common.title")}</TableCell>
            <TableCell>{t("cases.title")}</TableCell>
            <TableCell>{t("deadlines.type") || "Type"}</TableCell>
            <TableCell>{t("deadlines.dueDate")}</TableCell>
            <TableCell>{t("deadlines.completed") || "Completed"}</TableCell>
            <TableCell>{t("common.actions")}</TableCell>
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
                <TableCell>
                  {d.completed
                    ? t("common.yes") || "Yes"
                    : t("common.no") || "No"}
                </TableCell>
                <TableCell>
                  {!d.completed && (
                    <Button
                      size="small"
                      onClick={() => completeMutation.mutate(d.id)}
                      disabled={completeMutation.isPending}
                    >
                      {t("deadlines.complete") || "Complete"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {deadlines.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>{t("deadlines.noDeadlines")}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default DeadlinesListPage;
