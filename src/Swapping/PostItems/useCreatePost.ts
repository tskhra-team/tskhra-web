import { privateInstance } from "@/api";
import type { CreatePostItemPostData } from "@/Swapping/PostItems/PostItemsSchema";
import type { ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface PostCreateResponse {
  itemId: string;
}

const createPost = async (data: CreatePostItemPostData) => {
  const { photos, categoryId, subCategoryId, ...rest } = data;
  const finalData = { categoryId: subCategoryId, ...rest };
  const response = await privateInstance.post("/items", finalData);

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
