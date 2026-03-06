import { privateInstance } from "@/api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";

interface UploadPhotoResponse {
  id: string;
}

interface UploadBusinessPhotosResult {
  mainPhotoId: string;
  galleryPhotoIds: string[];
}

const uploadBusinessPhotos = async (
  data: File[],
): Promise<UploadBusinessPhotosResult> => {
  const uploadPromises = data.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await privateInstance.post<UploadPhotoResponse>(
      "/business/images",
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

  return {
    mainPhotoId: photoIds[0],
    galleryPhotoIds: photoIds.slice(1),
  };
};

const useUploadBusinessPhotos = () => {
  return useMutation<
    UploadBusinessPhotosResult,
    AxiosError<ErrorResponse>,
    File[]
  >({
    mutationFn: uploadBusinessPhotos,
    mutationKey: ["uploaded-photos"],
  });
};

export default useUploadBusinessPhotos;
