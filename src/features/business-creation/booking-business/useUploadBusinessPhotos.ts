import { privateInstance } from "@/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

interface UploadPhotoResponse {
  id: string;
}

interface UploadPhotoRequest {
  data: File[];
  businessId: string;
}

const uploadBusinessPhotos = async ({
  data,
  businessId,
}: UploadPhotoRequest): Promise<string[]> => {
  const uploadPromises = data.map(async (file, index) => {
    const formData = new FormData();
    formData.append("file", file);

    const isMainPhoto = index === 0;

    const response = await privateInstance.post<UploadPhotoResponse>(
      `business/${businessId}/images`,
      formData,
      {
        params: {
          isMain: isMainPhoto,
        },
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

const useUploadBusinessPhotos = () => {
  return useMutation<string[], AxiosError<ErrorResponse>, UploadPhotoRequest>({
    mutationFn: uploadBusinessPhotos,
    mutationKey: ["uploaded-photos"],
  });
};

export default useUploadBusinessPhotos;
