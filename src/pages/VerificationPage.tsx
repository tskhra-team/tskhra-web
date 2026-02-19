import useGetProfile from "@/features/profile/useGetProfile";
import AlreadyVerified from "@/features/verification/AlreadyVerified";
import Verification from "@/features/verification/Verification";

export default function VerificationPage() {
  const { data: profile } = useGetProfile();

  return profile?.status ? <AlreadyVerified /> : <Verification />;
}
