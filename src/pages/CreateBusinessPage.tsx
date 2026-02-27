import CreateBusiness from "@/features/business-creation/CreateBusiness";
import useGetUser from "@/features/user/useGetUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateBusinessPage() {
  const { data: user, isLoading } = useGetUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user?.isVerified) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user?.isVerified) {
    return null;
  }

  return <CreateBusiness />;
}
