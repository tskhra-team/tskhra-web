import { privateInstance } from "@/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

interface UploadPhotoResponse {
  id: string;
}

interface UploadPhotoRequest {
  data: File[];
  postId: string;
}

const uploadItemPhotos = async ({
  data,
  postId,
}: UploadPhotoRequest): Promise<string[]> => {
  const uploadPromises = data.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await privateInstance.post<UploadPhotoResponse>(
      `items/${postId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.id;
  });

  const photoIds = await Promise.all(uploadPromises);

  return photoIds;
};

const useUploadItemPhotos = () => {
  return useMutation<string[], AxiosError<ErrorResponse>, UploadPhotoRequest>({
    mutationFn: uploadItemPhotos,
    mutationKey: ["uploaded-photos"],
  });
};

export default useUploadItemPhotos;
