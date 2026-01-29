import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  registerSchema,
  type RegisterSchema,
} from "@/features/auth/authSchema";
import useRegister from "@/features/auth/useRegister";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: yupResolver(registerSchema),
  });
  const from = location.state?.from;
  const { mutate: signUp } = useRegister();
  const submitForm = (data: RegisterSchema) => {
    signUp(data, {
      onSuccess: (response) => {},
      onError: (error) => {
        console.error();
      },
    });
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#2d2d2d]">
      <Card className="w-100 bg-[#1E1E1E] text-white border-none">
        <CardHeader>
          <CardTitle>Register to your account</CardTitle>
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
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Enter your name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email.message}</p>
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
                  <p className="text-red-400 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Repeat Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black cursor-pointer border hover:border-white hover:text-white"
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div>
            <span className="text-sm">have account?</span>
            <Button
              variant="link"
              className="px-3 cursor-pointer text-white"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
