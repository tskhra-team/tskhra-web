import MyBusinesses from "@/features/my-businesses/MyBusinesses";
import useGetUser from "@/features/user/useGetUser";
import { useNavigate } from "react-router-dom";

export default function MyServicesPage() {
  const { data: user } = useGetUser();
  const navigate = useNavigate();

  if (!user?.isVerified) {
    navigate("/profile");
    return null;
  }
  return <MyBusinesses />;
}
