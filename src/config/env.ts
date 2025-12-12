// Validate and export environment variables with type safety

interface EnvConfig {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

function validateEnv(): EnvConfig {
  const apiUrl =
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error(
      "VITE_API_BASE_URL or VITE_API_URL is not defined. Please check your .env file."
    );
  }

  // Validate API URL format
  try {
    new URL(apiUrl);
  } catch {
    throw new Error(`Invalid VITE_API_URL format: ${apiUrl}`);
  }

  return {
    apiUrl,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  };
}

export const env = validateEnv();

// Usage: import { env } from './config/env';
// const apiUrl = env.apiUrl;
