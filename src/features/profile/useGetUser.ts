import { privateInstance } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
export type UserType = {
  status: string;
  userName: string;
  userEmail: string;
  createDate: string;
  phoneNumber: string;
  gender: string;
};
const getUser = async () => {
  const response = await privateInstance.get("/users/status");

  return response.data;
};

const useGetUser = () => {
  return useQuery<UserType, AxiosError>({
    queryFn: getUser,
    queryKey: ["getUser"],
    enabled: false, // DELETE THIS WHEN ENDPOINT IS READY!!!!
  });
};

export default useGetUser;
