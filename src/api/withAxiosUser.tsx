import Cookies from "js-cookie";
import type { FC, MutableRefObject, ReactElement, ReactNode } from "react";
import { memo, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/useAuth";
import { refreshTokens } from "@/features/auth/useRefreshTokens";
import { privateInstance } from ".";

interface Props {
  children: ReactNode;
}

type SubscribeCallback = (token: string) => void;

let refreshSubscribers: Array<SubscribeCallback> = [];
function onRrefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
}

function subscribeTokenRefresh(cb: SubscribeCallback) {
  refreshSubscribers.push(cb);
}

const refreshTokenHandler = async (
  setTokens: (
    tokens: { accessToken: string; refreshToken: string } | null,
  ) => void,
  actualAccessRef: MutableRefObject<string | undefined>,
) => {
  const refreshToken = Cookies.get("refreshToken");
  if (refreshToken) {
    try {
      const { accessToken: newAccess, refreshToken: newRefresh } =
        await refreshTokens(refreshToken);
      actualAccessRef.current = newAccess;
      setTokens({ accessToken: newAccess, refreshToken: newRefresh });
      return newAccess;
    } catch {
      setTokens(null);
      window.location.href = "/login";
    }
  } else {
    setTokens(null);
    window.location.href = "/login";
  }
  return null;
};

const WithAxiosUser: FC<Props> = ({ children }): ReactElement => {
  const { authState, setTokens } = useAuth();
  const [isSet, setIsSet] = useState<boolean>(false);
  const actualAccessRef = useRef<string | undefined>(authState?.accessToken);
  const isProcessingRef = useRef<boolean>(false);
  const accessToken = Cookies.get("accessToken");
  const searchParams = new URLSearchParams(window.location.search);
  const paymentStatus = searchParams.get("paymentStatus");

  useEffect(() => {
    if (!actualAccessRef.current) return;

    const requestInterceptor = privateInstance.interceptors.request.use(
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

    const responseInterceptor = privateInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401) {
          if (!isProcessingRef.current) {
            isProcessingRef.current = true;
            const newToken = await refreshTokenHandler(
              setTokens,
              actualAccessRef,
            );
            isProcessingRef.current = false;

            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              onRrefreshed(newToken);
              refreshSubscribers = [];
              return privateInstance.request(originalRequest);
            }
          }

          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(privateInstance(originalRequest));
            });
          });
        }

        return Promise.reject(error);
      },
    );

    setIsSet(true);

    return () => {
      privateInstance.interceptors.request.eject(requestInterceptor);
      privateInstance.interceptors.response.eject(responseInterceptor);
      refreshSubscribers = [];
    };
  }, [authState?.accessToken, setTokens]);

  if (!accessToken) {
    return <Navigate to="login" state={paymentStatus} />;
  }
  return <>{isSet && children}</>;
};

export default memo(WithAxiosUser);
