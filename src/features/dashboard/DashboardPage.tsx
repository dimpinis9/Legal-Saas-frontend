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

const DashboardPage: React.FC = () => {
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
    return <ErrorState message="Failed to load dashboard data" />;
  }

  const upcoming = upcomingDeadlinesQuery.data || [];
  const openCases = openCasesQuery.data || [];
  const openTasks = openTasksQuery.data || [];

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Dashboard
      </Typography>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Open Cases</Typography>
              <Typography variant="h4">{openCases.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Open Tasks</Typography>
              <Typography variant="h4">{openTasks.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">
                Upcoming Deadlines (7d)
              </Typography>
              <Typography variant="h4">{upcoming.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Upcoming Deadlines
          </Typography>
          {upcoming.length === 0 && (
            <Typography>No deadlines in next 7 days.</Typography>
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
