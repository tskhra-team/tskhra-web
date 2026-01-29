import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useCallback, useState, type ReactNode } from "react";

import { AuthContext } from "./useAuth";

interface AuthState {
  accessToken: string;
  refreshToken: string;
}
export interface AuthContextType {
  authState: AuthState | null;
  login: (data: AuthState) => void;
  logout: () => void;
  setTokens: (tokens: AuthState | null) => void;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState | null>({
    accessToken: Cookies.get("accessToken") || "",
    refreshToken: Cookies.get("refreshToken") || "",
  });

  const login = (data: AuthState) => {
    setAuthState(data);
    Cookies.set("accessToken", data.accessToken, {
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("refreshToken", data.refreshToken, {
      secure: true,
      sameSite: "Strict",
    });
  };

  const logout = () => {
    setAuthState(null);
    queryClient.clear();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };

  const setTokens = useCallback((tokens: AuthState | null) => {
    if (!tokens) {
      setAuthState(null);
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      return;
    }

    setAuthState(tokens);

    Cookies.set("accessToken", tokens.accessToken, {
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("refreshToken", tokens.refreshToken, {
      secure: true,
      sameSite: "Strict",
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        setTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
