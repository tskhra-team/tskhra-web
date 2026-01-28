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

// const loginSchema = yup.

export default function Login() {
  const navigate = useNavigate();
  const localtion = useLocation();

  const from = localtion.state?.from;

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
          <form>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-white text-black cursor-pointer border hover:border-white hover:text-white"
            onClick={() => navigate(from || "/")}
          >
            Login
          </Button>
          <div>
            <span className="text-sm">Don't have account yet?</span>
            <Button
              variant="link"
              className="px-3 cursor-pointer text-white"
              onClick={() => navigate("/register")}
            >
              Sing up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
