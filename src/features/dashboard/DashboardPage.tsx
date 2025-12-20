import React from "react";
import { useQuery } from "@tanstack/react-query";
import { deadlinesApi } from "../../api/deadlinesApi";
import { casesApi } from "../../api/casesApi";
import { tasksApi } from "../../api/tasksApi";
import { Box, Card, CardContent, Grid, Typography, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import QuickAddCase from "../../components/common/QuickAddCase";
import { useTranslation } from "react-i18next";

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);
  const upcomingDeadlinesQuery = useQuery({
    queryKey: ["deadlines", { nextDays: 7 }],
    queryFn: () => deadlinesApi.getDeadlines({ nextDays: 7 }),
  });

  const openCasesQuery = useQuery({
    queryKey: ["cases", { status: "OPEN" }],
    queryFn: () => casesApi.getCases({ status: "OPEN" }),
  });

  const openTasksQuery = useQuery({
    queryKey: ["tasks", { status: "OPEN" }],
    queryFn: () => tasksApi.getTasks({ status: "OPEN" }),
  });

  if (
    upcomingDeadlinesQuery.isLoading ||
    openCasesQuery.isLoading ||
    openTasksQuery.isLoading
  ) {
    return <LoadingState />;
  }

  if (
    upcomingDeadlinesQuery.isError ||
    openCasesQuery.isError ||
    openTasksQuery.isError
  ) {
    return <ErrorState message={t("errors.generic")} />;
  }

  const upcoming = upcomingDeadlinesQuery.data || [];
  const openCases = openCasesQuery.data || [];
  const openTasks = openTasksQuery.data || [];

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        {t("dashboard.title")}
      </Typography>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">
                {t("dashboard.activeCases")}
              </Typography>
              <Typography variant="h4">{openCases.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">
                {t("dashboard.pendingTasks")}
              </Typography>
              <Typography variant="h4">{openTasks.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">
                {t("dashboard.upcomingDeadlines")}
              </Typography>
              <Typography variant="h4">{upcoming.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            {t("dashboard.upcomingDeadlines")}
          </Typography>
          {upcoming.length === 0 && (
            <Typography>{t("deadlines.noDeadlines")}</Typography>
          )}
          {upcoming.map((d) => (
            <Box
              key={d.id}
              display="flex"
              justifyContent="space-between"
              py={1}
              borderBottom="1px solid #eee"
            >
              <Typography>{d.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(d.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={() => setQuickAddOpen(true)}
      >
        <AddIcon />
      </Fab>

      <QuickAddCase
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />
    </Box>
  );
};

export default DashboardPage;
