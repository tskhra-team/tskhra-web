
import { publicInstance } from '@/api';
import type { ErrorResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';


type BookingSingleBusinessType = {
  businessName: string;
  businessPhoto: string;
  description: string | null;
  id: string;
  mainImageUrl: string;
  callType: string;
  city: string;

}



const getBookingSingleBusiness = async (businessId: string) => {
  const response = await publicInstance.get(`/business/${businessId}`);
  return response.data
};

const useGetBookingSingleBusiness = (businessId: string) =>{
  return useQuery<BookingSingleBusinessType, AxiosError<ErrorResponse>> ({
    queryFn: () => getBookingSingleBusiness(businessId),
    queryKey: ['business', businessId],
    staleTime: 5 * 60 * 1000
  })
}


export default useGetBookingSingleBusiness;