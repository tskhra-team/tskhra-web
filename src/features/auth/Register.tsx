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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: yupResolver(registerSchema),
  });
  const from = location.state?.from;
  const { mutate: signUp } = useRegister();
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
    <div className="w-screen h-screen flex items-center justify-center bg-[#2d2d2d]">
      <Card className="w-[420px] bg-[#1E1E1E] text-white border-none">
        <CardHeader>
          <CardTitle>Register to your account</CardTitle>
          <CardDescription>Start your journey here!</CardDescription>
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
              <div className="flex flex-col">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  {...register("name")}
                  className="mt-2"
                />
                <p className="text-red-500 text-sm mt-1 min-h-5">
                  {errors.name?.message || "\u00A0"}
                </p>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="mt-2"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="mt-2"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="confirmPassword">Repeat Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                  className="mt-2"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-transparent hover:text-white hover:border-white"
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div>
            <span className="text-sm">Already have an account?</span>
            <Button
              variant="link"
              className="px-3 text-white"
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
