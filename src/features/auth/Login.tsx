import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const { t } = useTranslation(["auth", "common"]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { login, register, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from || "/");
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = () => {
    setIsRedirecting(true);
    login(); // This will redirect to Keycloak login page
  };

  const handleRegister = () => {
    setIsRedirecting(true);
    register(); // This will redirect to Keycloak registration page
  };

  return (
    <>
      <Card className="relative z-10 w-100 bg-white/90 backdrop-blur-xl text-slate-900 border-2 border-slate-200/50 shadow-xl mt-6">
        <CardHeader>
          <CardTitle className="text-slate-900">Choose your option</CardTitle>
          {/* <CardDescription className="text-slate-600"></CardDescription> */}
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <CardDescription className="text-slate-600">
            Already have account?
          </CardDescription>

          <Button
            onClick={handleLogin}
            disabled={isRedirecting}
            className="w-full bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {isRedirecting ? "Wait a second..." : t("auth:login.button")}
          </Button>

          <CardDescription className="text-slate-600">
            Don't have account yet? Start yor journie here?
          </CardDescription>

          <Button
            onClick={handleRegister}
            disabled={isRedirecting}
            className="w-full bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {isRedirecting ? "Wait a second..." : t("auth:register.button")}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
