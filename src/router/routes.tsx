import React, { Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import LoadingState from "@components/common/LoadingState";
import AppLayout from "../components/layout/AppLayout.tsx";
import { useAuth } from "../hooks/useAuth.ts";

// Lazy load pages for code splitting
const LoginPage = React.lazy(() => import("../features/auth/LoginPage.tsx"));
const DashboardPage = React.lazy(
  () => import("../features/dashboard/DashboardPage.tsx")
);
const ClientsListPage = React.lazy(
  () => import("../features/clients/ClientsListPage.tsx")
);
const ClientDetailsPage = React.lazy(
  () => import("../features/clients/ClientDetailsPage.tsx")
);
const CasesListPage = React.lazy(
  () => import("../features/cases/CasesListPage.tsx")
);
const CaseDetailsPage = React.lazy(
  () => import("../features/cases/CaseDetailsPage.tsx")
);
const CalendarPage = React.lazy(
  () => import("../features/calendar/CalendarPage.tsx")
);
const DeadlinesListPage = React.lazy(
  () => import("../features/deadlines/DeadlinesListPage.tsx")
);
const TasksListPage = React.lazy(
  () => import("../features/tasks/TasksListPage.tsx")
);

const SuspenseWrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Suspense fallback={<LoadingState />}>{children}</Suspense>
);

const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingState />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const appRoutes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "clients",
        element: (
          <SuspenseWrapper>
            <ClientsListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "clients/:id",
        element: (
          <SuspenseWrapper>
            <ClientDetailsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "cases",
        element: (
          <SuspenseWrapper>
            <CasesListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "cases/:id",
        element: (
          <SuspenseWrapper>
            <CaseDetailsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "calendar",
        element: (
          <SuspenseWrapper>
            <CalendarPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "deadlines",
        element: (
          <SuspenseWrapper>
            <DeadlinesListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "tasks",
        element: (
          <SuspenseWrapper>
            <TasksListPage />
          </SuspenseWrapper>
        ),
      },
      { index: true, element: <Navigate to="/dashboard" replace /> },
    ],
  },
];
