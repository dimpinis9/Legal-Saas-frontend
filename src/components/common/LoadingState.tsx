import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const LoadingState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      width="100%"
      gap={2}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {t("common.loading")}
      </Typography>
    </Box>
  );
};

export default LoadingState;
