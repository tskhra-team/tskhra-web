import Keycloak from "keycloak-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const keycloakClient = new Keycloak({
  url: "http://10.227.164.247:8080",
  realm: "tskhra",
  clientId: "react-client",
});

export const useKeycloak = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloakClient.init({
          onLoad: "check-sso",
          checkLoginIframe: false,
        });

        setIsAuthenticated(authenticated);
        setToken(keycloakClient.token);
        setRefreshToken(keycloakClient.refreshToken);

        // Auto-refresh token
        keycloakClient.onTokenExpired = () => {
          keycloakClient.updateToken(30).then((refreshed) => {
            if (refreshed) {
              setToken(keycloakClient.token);
              setRefreshToken(keycloakClient.refreshToken);
            }
          });
        };
      } catch (error: unknown) {
        toast.error(`Failed to initialize Keycloak: ${error}`, {
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const login = () => {
    keycloakClient.login();
  };

  const logout = () => {
    keycloakClient.logout();
  };

  const register = () => {
    keycloakClient.register();
  };

  return {
    isAuthenticated,
    isLoading,
    token,
    refreshToken,
    login,
    logout,
    register,
    keycloak: keycloakClient,
  };
};
