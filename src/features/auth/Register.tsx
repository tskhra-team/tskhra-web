import Modal from "@/components/Modal";
import RegistrationSuccess from "@/components/RegistrationSuccess";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  getRegisterSchema,
  type RegisterSchemaType,
} from "@/features/auth/authSchema";
import useRegister from "@/features/auth/useRegister";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const { t } = useTranslation(["auth", "common"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: yupResolver(getRegisterSchema(t)),
  });

  const { mutate: signUp, isPending } = useRegister();

  const submitForm = (data: RegisterSchemaType) => {
    signUp(data, {
      onSuccess: () => {
        setOpen(true);
        sessionStorage.setItem("userEmail", data.email);
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message;

        if (error.response?.status === 409) {
          toast.error(errorMessage || "User already exists", {
            position: "top-center",
          });
        } else if (error.response?.status === 500) {
          toast.error(errorMessage || "Server error - Please try again later", {
            position: "top-center",
          });
        } else {
          toast.error(errorMessage || "Registration failed", {
            position: "top-center",
          });
        }
      },
    });
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleContinue = () => {
    setOpen(false);
    navigate("/login");
  };
  return (
    <>
      <Card className="relative z-10 w-100 bg-white/90 backdrop-blur-xl text-slate-900 border-2 border-slate-200/50 shadow-xl mt-6">
        <CardHeader>
          <CardTitle className="text-slate-900">
            {t("auth:register.title")}
          </CardTitle>
          <CardDescription className="text-slate-600">
            {t("auth:register.description")}
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              className="text-slate-700 hover:text-slate-900"
              onClick={() => navigate(from || "/")}
            >
              {t("common:buttons.goBack")}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="username" className="text-slate-700">
                  {t("common:form.name")}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t("common:form.namePlaceholder")}
                  {...register("username")}
                  className=" bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
                {errors.username && (
                  <span className="text-red-500 text-sm">
                    {errors.username.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="email" className="text-slate-700">
                  {t("common:form.email")}
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder={t("common:form.emailPlaceholder")}
                  {...register("email")}
                  className=" bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="password" className="text-slate-700">
                  {t("common:form.password")}
                </Label>

                <PasswordInput
                  id="password"
                  placeholder={t("common:form.passwordPlaceholder")}
                  {...register("password")}
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                />

                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="confirmPassword" className="text-slate-700">
                  {t("common:form.repeatPassword")}
                </Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder={t("common:form.repeatPasswordPlaceholder")}
                  {...register("confirmPassword")}
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <CardFooter className="flex-col gap-4 px-0 mt-8">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {isPending
                  ? t("auth:register.buttonLoading")
                  : t("auth:register.button")}
              </Button>
            </CardFooter>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="text-sm text-slate-600">
              {t("auth:register.hasAccount")}
            </span>
            <Button
              variant="link"
              className="px-3 cursor-pointer text-blue-600 hover:text-blue-700"
              onClick={() => navigate("/login")}
            >
              {t("auth:register.loginLink")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Modal isOpen={open} onClose={handleCloseModal}>
        <RegistrationSuccess onClose={handleContinue} />
      </Modal>
    </>
  );
}
