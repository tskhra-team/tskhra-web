import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

/**
 * Component that handles redirect after login.
 * Must be rendered inside Router context.
 */
export const AuthRedirectHandler = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl, { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  return null;
};
