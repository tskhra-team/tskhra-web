import { privateInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
export type UserType = {
  userName: string;
  firstName: string | undefined;
  secondName: string | undefined;
  imageUrl: string | undefined;
};
const getUser = async () => {
  const response = await privateInstance.get("/user/me");

  return response.data;
};

const useGetUser = () => {
  return useQuery<UserType, AxiosError>({
    queryFn: getUser,
    queryKey: ["getUser"],
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetUser;
