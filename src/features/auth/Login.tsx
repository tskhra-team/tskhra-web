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
import { useAuth } from "@/context/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoginSchema, type LoginSchemaType } from "./authSchema";
import useLogin from "./useLogin";

export default function Login() {
  const navigate = useNavigate();
  const localtion = useLocation();
  const from = localtion.state?.from;
  const userEmail = sessionStorage.getItem("userEmail");
  const { t } = useTranslation(["auth", "common"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: yupResolver(getLoginSchema(t)),
    defaultValues: {
      email: userEmail || "",
    },
  });

  const { mutate: login, isPending } = useLogin(); // getting token from API
  const { login: authLogin } = useAuth(); //setting tokens to cookies

  const onSubmit = async (data: LoginSchemaType) => {
    login(data, {
      //here we sending to api our user data
      onSuccess: (response) => {
        const { access_token, refresh_token } = response;
        authLogin({ accessToken: access_token, refreshToken: refresh_token }); // if user is exist - back give us token and we set it to cookies
        navigate(from || "/");
      },
      onError: (error) => {
        console.log(error);
        // alert(`Something went wrong ${error.message}`);
      },
    });
  };

  return (
    <>
      <Card className="relative z-10 w-100 bg-white/90 backdrop-blur-xl text-slate-900 border-2 border-slate-200/50 shadow-xl mt-6">
        <CardHeader>
          <CardTitle className="text-slate-900">
            {t("auth:login.title")}
          </CardTitle>
          <CardDescription className="text-slate-600">
            {t("auth:login.description")}{" "}
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="email" className="text-slate-700">
                  {t("common:form.email")}
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder={t("common:form.emailPlaceholder")}
                  {...register("email")}
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
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
            </div>

            <CardFooter className="flex-col gap-4 px-0 mt-8">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {isPending
                  ? t("auth:login.buttonLoading")
                  : t("auth:login.button")}
              </Button>
            </CardFooter>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="text-sm text-slate-600">
              {t("auth:login.noAccount")}
            </span>
            <Button
              variant="link"
              className="px-3 cursor-pointer text-blue-600 hover:text-blue-700"
              onClick={() => navigate("/register")}
              type="button"
            >
              {t("auth:login.signUpLink")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
