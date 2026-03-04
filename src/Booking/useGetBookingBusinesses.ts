
import { publicInstance } from '@/api';
import type { ErrorResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';


type BookingBusinessesType = {
  businessName: string;
  businessPhoto: string;
  description: string | null;
  id: string;
  mainImageUrl: string;
  callType: string;
  city: string;

}


const getBookingBusinesses = async () => {
  const response = await publicInstance.get("/business/all");
  console.log('lalall')
  return response.data
};

const useGetBookingBusinesses = () =>{
  return useQuery<BookingBusinessesType[], AxiosError<ErrorResponse>> ({
    queryFn: getBookingBusinesses,
    queryKey: ["business-all"],
    staleTime: 5 * 60 * 1000
  })
}


export default useGetBookingBusinesses;