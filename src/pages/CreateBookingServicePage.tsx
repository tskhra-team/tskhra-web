import CreateBookingService from "@/Booking/CreateBookingService";
import useGetProfile from "@/features/profile/useGetProfile";
import { useNavigate } from "react-router-dom";

export default function CreateBookingServicePage() {
  const { data: profile } = useGetProfile();
  const navigate = useNavigate();

  if (!profile?.status) {
    navigate("/");
    return null;
  }

  return <CreateBookingService />;
}
