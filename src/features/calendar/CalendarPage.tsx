import React, { useMemo } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { el } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { deadlinesApi } from "../../api/deadlinesApi";
import { tasksApi } from "../../api/tasksApi";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../components/common/LoadingState";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "el-GR": el,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: el }),
  getDay,
  locales,
});

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();

  const deadlinesQuery = useQuery({
    queryKey: ["deadlines"],
    queryFn: () => deadlinesApi.getDeadlines(),
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksApi.getTasks(),
  });

  const events: Event[] = useMemo(() => {
    const deadlines = deadlinesQuery.data || [];
    const tasks = tasksQuery.data || [];

    const deadlineEvents = deadlines.map((deadline) => ({
      id: `deadline-${deadline.id}`,
      title: `⏰ ${deadline.title}`,
      start: new Date(deadline.dueDate),
      end: new Date(deadline.dueDate),
      resource: {
        type: "deadline",
        itemType: deadline.type,
        caseFileId: deadline.caseFileId,
        completed: deadline.completed,
      },
    }));

    const taskEvents = tasks.map((task) => ({
      id: `task-${task.id}`,
      title: `📋 ${task.title}`,
      start: task.dueDate ? new Date(task.dueDate) : new Date(),
      end: task.dueDate ? new Date(task.dueDate) : new Date(),
      resource: {
        type: "task",
        caseFileId: task.caseFileId,
        completed: task.status === "COMPLETED",
      },
    }));

    return [...deadlineEvents, ...taskEvents];
  }, [deadlinesQuery.data, tasksQuery.data]);

  if (deadlinesQuery.isLoading || tasksQuery.isLoading) return <LoadingState />;

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#1976d2";

    if (event.resource.type === "task") {
      backgroundColor = event.resource.completed ? "#66bb6a" : "#ff9800";
    } else if (event.resource.type === "deadline") {
      backgroundColor = event.resource.completed ? "#4caf50" : "#f44336";
    }

    const style: React.CSSProperties = {
      backgroundColor,
      borderRadius: "5px",
      opacity: event.resource.completed ? 0.7 : 1,
      color: "white",
      border: "none",
      display: "block",
    };
    return { style };
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Ημερολόγιο Προθεσμιών & Εργασιών</Typography>
        <Box display="flex" gap={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#f44336",
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Προθεσμίες</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#ff9800",
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Εργασίες</Typography>
          </Box>
        </Box>
      </Box>
      <Paper sx={{ p: 2, height: 700 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event: any) => {
            navigate(`/cases/${event.resource.caseFileId}`);
          }}
          messages={{
            today: "Σήμερα",
            previous: "Προηγούμενο",
            next: "Επόμενο",
            month: "Μήνας",
            week: "Εβδομάδα",
            day: "Ημέρα",
            agenda: "Ατζέντα",
            date: "Ημερομηνία",
            time: "Ώρα",
            event: "Γεγονός",
            noEventsInRange: "Δεν υπάρχουν γεγονότα σε αυτό το εύρος.",
          }}
        />
      </Paper>
    </Box>
  );
};

export default CalendarPage;
