import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const { t } = useTranslation();

  return (
    <Box textAlign="center" p={3}>
      <Typography color="error" mb={2}>
        {message || t("errors.generic")}
      </Typography>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          {t("errors.tryAgain")}
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
