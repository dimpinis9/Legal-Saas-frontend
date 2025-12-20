import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi } from "../api/authApi.ts";
import { setAuthToken } from "../api/httpClient.ts";
import type { AuthCredentials, AuthResponse } from "../types/auth.ts";

interface AuthContextValue {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

const TOKEN_STORAGE_KEY = "auth_token";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      setAccessToken(stored);
      setAuthToken(stored); // Set token in httpClient
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: AuthCredentials) => {
    const res: AuthResponse = await authApi.login(credentials);
    setAccessToken(res.accessToken);
    setAuthToken(res.accessToken); // Set token in httpClient
    localStorage.setItem(TOKEN_STORAGE_KEY, res.accessToken);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setAuthToken(null); // Clear token from httpClient
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: !!accessToken,
      isLoading,
      login,
      logout,
    }),
    [accessToken, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
