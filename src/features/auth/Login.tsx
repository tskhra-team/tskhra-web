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
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchemaType } from "./authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "./useLogin";
import { useAuth } from "@/context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const localtion = useLocation();
  const from = localtion.state?.from;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: yupResolver(loginSchema),
  });

  const { mutate: login } = useLogin();
  const { login: authLogin } = useAuth();

  const onSubmit = async (data: LoginSchemaType) => {
    console.log("LOGIN DATA", data);

    login(data, {
      onSuccess: (response) => {
        authLogin(response);
        navigate(from || "/");
      },
      onError: (error) => {
        alert(`Something went wrong ${error.message}`);
      },
    });

    // navigate(from || "/");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#2d2d2d]">
      <Card className="w-100 bg-[#1E1E1E] text-white border-none">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Welcome back, enter your data to continue!{" "}
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              className="text-white"
              onClick={() => navigate(from || "/")}
            >
              Go back
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
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
                disabled={isSubmitting}
                className="w-full bg-white text-black cursor-pointer border hover:border-white hover:text-white"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="text-sm">Don't have account yet?</span>
            <Button
              variant="link"
              className="px-3 cursor-pointer text-white"
              onClick={() => navigate("/register")}
              type="button"
            >
              Sing up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
