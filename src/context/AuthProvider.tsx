import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode } from "react";

import Loader from "@/components/Loader";
import { useKeycloak } from "@/features/auth/useKeycloak";
import { AuthContext } from "./useAuth";

interface AuthState {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  // Keycloak properties
  isAuthenticated: boolean;
  token: string | undefined;
  refreshToken: string | undefined;

  // Auth actions
  login: () => void;
  logout: () => void;
  register: () => void;

  // Legacy compatibility (used in AppLayout)
  authState: AuthState | null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const keycloak = useKeycloak();

  const handleLogout = () => {
    keycloak.logout();
    queryClient.clear();
  };

  // Legacy compatibility - map Keycloak token to old authState format
  const authState: AuthState | null = keycloak.token
    ? { accessToken: keycloak.token, refreshToken: keycloak.refreshToken || "" }
    : null;

  // Show loading state while Keycloak initializes
  if (keycloak.isLoading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: keycloak.isAuthenticated,
        token: keycloak.token,
        refreshToken: keycloak.refreshToken,
        login: keycloak.login,
        logout: handleLogout,
        register: keycloak.register,
        authState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
