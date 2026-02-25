import CreateBookingService from "@/Booking/CreateBookingService";
import useGetUser from "@/features/user/useGetUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CreateBookingServicePage() {
  const { data: user, isLoading } = useGetUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user?.isVerified) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  console.log(user?.isVerified);

  if (isLoading || !user?.isVerified) {
    return null;
  }

  return <CreateBookingService />;
}
