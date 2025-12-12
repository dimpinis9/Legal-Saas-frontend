import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong.",
  onRetry,
}) => (
  <Box textAlign="center" p={3}>
    <Typography color="error" mb={2}>
      {message}
    </Typography>
    {onRetry && (
      <Button variant="outlined" onClick={onRetry}>
        Retry
      </Button>
    )}
  </Box>
);

export default ErrorState;
