import { privateInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
export type UserType = {
  userEmail: string;
  userName: string;
  firstName: string | undefined;
  secondName: string | undefined;
  status: boolean;
  createDate: string;
  phoneNumber: string | undefined;
  gender: string | undefined;
  birthDate: string | undefined;
};
const getProfile = async () => {
  const response = await privateInstance.get("/user/profile"); //random endpoint here now

  return response.data;
};

const useGetProfile = () => {
  return useQuery<UserType, AxiosError>({
    queryFn: getProfile,
    queryKey: ["getProfile"],
  });
};

export default useGetProfile;
