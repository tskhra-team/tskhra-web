import { privateInstance } from "@/api";
import type { ProfileType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const getProfile = async () => {
  const response = await privateInstance.get("/user-profile/me");

  return response.data;
};

const useGetProfile = () => {
  return useQuery<ProfileType, AxiosError>({
    queryFn: getProfile,
    queryKey: ["getProfile"],
  });
};

export default useGetProfile;
