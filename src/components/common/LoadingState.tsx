import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingState: React.FC = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    minHeight="200px"
    width="100%"
  >
    <CircularProgress />
  </Box>
);

export default LoadingState;
