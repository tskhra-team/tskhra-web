import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      retryOnMount: false,
    },
    mutations: {
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error("Unauthorized - Please log in");
          } else if (error.response?.status === 500) {
            toast.error("Server error - Please try again later");
          } else if (!error.response) {
            toast.error("Network error - Check your connection");
          }
        }
      },
    },
  },
});

export default queryClient;
