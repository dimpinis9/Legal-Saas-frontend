import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { appRoutes } from "./router/routes.tsx";

const AppRoutes: React.FC = () => {
  const routes = useRoutes(appRoutes);
  return routes;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
