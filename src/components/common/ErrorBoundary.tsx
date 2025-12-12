import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Optionally send to error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          p={3}
        >
          <Card sx={{ maxWidth: 500 }}>
            <CardContent>
              <Typography variant="h5" color="error" gutterBottom>
                Κάτι πήγε στραβά
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Η εφαρμογή αντιμετώπισε ένα απροσδόκητο σφάλμα.
              </Typography>
              {this.state.error && (
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    bgcolor: "grey.100",
                    p: 2,
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  {this.state.error.message}
                </Typography>
              )}
              <Box display="flex" gap={2}>
                <Button variant="contained" onClick={this.handleReset}>
                  Δοκίμασε ξανά
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                >
                  Ανανέωση σελίδας
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}
