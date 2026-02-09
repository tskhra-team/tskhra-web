import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  useCallback,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { UserType } from "@/features/profile/useGetUser";
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
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState | null>({
    accessToken: Cookies.get("accessToken") || "",
    refreshToken: Cookies.get("refreshToken") || "",
  });

  const [user, setUser] = useState<UserType | null>({
    status: "none",
    userName: "Anano Topuria",
    userEmail: "mail@gmail.com",
    createDate: "19-20-2026",
    phoneNumber: "908765673832",
    gender: "female",
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
    setUser(null);
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
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
