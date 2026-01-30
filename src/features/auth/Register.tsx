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
import {
  registerSchema,
  type RegisterSchemaType,
} from "@/features/auth/authSchema";
import useRegister from "@/features/auth/useRegister";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

export default function Register() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: yupResolver(registerSchema),
  });

  const { mutate: signUp, isPending } = useRegister();

  const submitForm = (data: RegisterSchemaType) => {
    signUp(data, {
      onSuccess: () => {
        setOpen(true);
      },
      onError: (error) => {
        console.error(data);
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
    <div className="w-screen h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-orange-50/20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>

      <Card className="relative z-10 w-105 bg-white/90 backdrop-blur-xl text-slate-900 border-2 border-slate-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Register to your account</CardTitle>
          <CardDescription className="text-slate-600">Start your journey here!</CardDescription>
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
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="username" className="text-slate-700">Name</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  {...register("username")}
                  className="mt-2 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="mt-2 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="mt-2 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="confirmPassword" className="text-slate-700">Repeat Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                  className="mt-2 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1E1E1E] hover:bg-[#2E2E2E] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {isPending ? "Registration in progress..." : "Register"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div>
            <span className="text-sm text-slate-600">Already have an account?</span>
            <Button
              variant="link"
              className="px-3 text-blue-600 hover:text-blue-700"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Modal isOpen={open} onClose={handleCloseModal}>
        <RegistrationSuccess onClose={handleContinue} />
      </Modal>
    </div>
  );
}
