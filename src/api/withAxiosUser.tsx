import type { FC, ReactElement, ReactNode } from "react";
import { memo, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/useAuth";
import { keycloakClient } from "@/features/auth/useKeycloak";
import { toast } from "sonner";
import { privateInstance } from ".";

interface Props {
  children: ReactNode;
}

type SubscribeCallback = (token: string) => void;

let refreshSubscribers: Array<SubscribeCallback> = [];
function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
}

function subscribeTokenRefresh(cb: SubscribeCallback) {
  refreshSubscribers.push(cb);
}

const refreshTokenHandler = async (actualAccessRef: {
  current: string | undefined;
}) => {
  try {
    // Use Keycloak's built-in token refresh (minValidity forces refresh)
    const refreshed = await keycloakClient.updateToken(5);

    if (refreshed && keycloakClient.token) {
      actualAccessRef.current = keycloakClient.token;
      return keycloakClient.token;
    }
  } catch (error: unknown) {
    toast.error(`Failed to refresh token: ${error}`, {
      position: "top-center",
    });

    // Token refresh failed - logout and redirect
    keycloakClient.logout();
  }
  return null;
};

const WithAxiosUser: FC<Props> = ({ children }): ReactElement => {
  const { token, isAuthenticated } = useAuth();
  const [isSet, setIsSet] = useState<boolean>(false);
  const actualAccessRef = useRef<string | undefined>(token);
  const isProcessingRef = useRef<boolean>(false);
  const searchParams = new URLSearchParams(window.location.search);
  const paymentStatus = searchParams.get("paymentStatus");

  // Update ref when token changes
  useEffect(() => {
    actualAccessRef.current = token;
  }, [token]);

  useEffect(() => {
    if (!actualAccessRef.current) return;

    const addInterceptors = (instance: typeof privateInstance) => {
      const reqId = instance.interceptors.request.use(
        (request) => {
          if (request.headers) {
            request.headers.Authorization = actualAccessRef.current
              ? `Bearer ${actualAccessRef.current}`
              : "";
          }
          return request;
        },
        (error) => Promise.reject(error.response),
      );

      const resId = instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          if (error.response?.status === 401 && !originalRequest._retry) {
            if (!isProcessingRef.current) {
              isProcessingRef.current = true;
              originalRequest._retry = true;

              const newToken = await refreshTokenHandler(actualAccessRef);
              isProcessingRef.current = false;

              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                onRefreshed(newToken);
                refreshSubscribers = [];
                return instance.request(originalRequest);
              }
            }

            return new Promise((resolve) => {
              subscribeTokenRefresh((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(instance(originalRequest));
              });
            });
          }

          return Promise.reject(error);
        },
      );

      return { reqId, resId };
    };

    const main = addInterceptors(privateInstance);

    setIsSet(true);

    return () => {
      privateInstance.interceptors.request.eject(main.reqId);
      privateInstance.interceptors.response.eject(main.resId);
      refreshSubscribers = [];
    };
  }, [token]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={paymentStatus} />;
  }

  return <>{isSet && children}</>;
};

export default memo(WithAxiosUser);
