import { privateInstance } from "@/api";
import type { ErrorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type UserType = {
  userName: string;
  firstName: string | undefined;
  lastName: string | undefined;
  userEmail: string;
};

const getUser = async () => {
  const response = await privateInstance.get("/users/me");

  return response.data;
};

const useGetUser = () => {
  return useQuery<UserType, AxiosError<ErrorResponse>>({
    queryFn: getUser,
    queryKey: ["getUser"],
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetUser;
