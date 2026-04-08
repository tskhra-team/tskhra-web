import { privateInstance } from "@/api";
import type { CreatePostItemPostData } from "@/Swapping/PostItems/PostItemsSchema";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface PostCreateResponse {
  postId: string;
}

const createPost = async (data: CreatePostItemPostData) => {
  const { photos, categoryId, ...rest } = data;
  const response = await privateInstance.post("/api/items", rest);

  return response.data;
};

const useCreatePost = () => {
  return useMutation<
    PostCreateResponse,
    AxiosError<ErrorResponse>,
    CreatePostItemPostData
  >({
    mutationFn: createPost,
  });
};

export default useCreatePost;
