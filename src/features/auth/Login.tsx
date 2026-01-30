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
import { useAuth } from "@/context/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { loginSchema, type LoginSchemaType } from "./authSchema";
import useLogin from "./useLogin";

export default function Login() {
  const navigate = useNavigate();
  const localtion = useLocation();
  const from = localtion.state?.from;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: yupResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLogin(); // getting token from API
  const { login: authLogin } = useAuth(); //setting tokens to cookies

  const onSubmit = async (data: LoginSchemaType) => {
    console.log("LOGIN DATA", data);

    login(data, {
      //here we sending to api our user data
      onSuccess: (response) => {
        authLogin(response); // if user is exist - back give us token and we set it to cookies
        navigate(from || "/");
      },
      onError: (error) => {
       console.log(error)
        // alert(`Something went wrong ${error.message}`);
      },
    });
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <Card className="relative z-10 w-100 bg-white/90 backdrop-blur-xl text-slate-900 border-2 border-slate-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Login to your account</CardTitle>
          <CardDescription className="text-slate-600">
            Welcome back, enter your data to continue!{" "}
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              className="text-slate-700 hover:text-slate-900"
              onClick={() => navigate(from || "/")}
            >
              Go back
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
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
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
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
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="text-sm text-slate-600">Don't have account yet?</span>
            <Button
              variant="link"
              className="px-3 cursor-pointer text-blue-600 hover:text-blue-700"
              onClick={() => navigate("/register")}
              type="button"
            >
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
