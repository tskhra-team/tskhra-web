import { Button } from "@/components/ui/button";
import Register from "@/features/auth/Register";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  return (
    <>
      <Register />
      <Button onClick={() => navigate("/")}>back</Button>
    </>
  );
}
