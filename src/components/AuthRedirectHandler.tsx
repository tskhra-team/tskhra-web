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
      const savedScroll = localStorage.getItem("scrollAfterLogin");

      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        localStorage.removeItem("scrollAfterLogin");
        navigate(redirectUrl, { replace: true });

        if (savedScroll) {
          const scrollY = Number(savedScroll);
          // Retry scroll restoration until page content is tall enough or max attempts reached
          let attempts = 0;
          const maxAttempts = 20;
          const tryScroll = () => {
            window.scrollTo(0, scrollY);
            attempts++;
            if (Math.abs(window.scrollY - scrollY) > 1 && attempts < maxAttempts) {
              requestAnimationFrame(tryScroll);
            }
          };
          requestAnimationFrame(tryScroll);
        }
      }
    }
  }, [isAuthenticated, navigate]);

  return null;
};
