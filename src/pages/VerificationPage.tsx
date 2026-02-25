import useGetUser from "@/features/user/useGetUser";
import AlreadyVerified from "@/features/verification/AlreadyVerified";
import Verification from "@/features/verification/Verification";

export default function VerificationPage() {
  const { data: user } = useGetUser();

  return user?.isVerified ? <AlreadyVerified /> : <Verification />;
}
