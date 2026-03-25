import { publicInstance } from "@/api";
import { useQueries } from "@tanstack/react-query";

const getBusinessTimeslots = async (
  businessId: string,
  date: string,
  serviceId: string,
) => {
  const response = await publicInstance.get(
    `/business/${businessId}/timeslots`,
    {
      params: {
        date,
        serviceId,
      },
    },
  );
  return response.data as number[];
};

const useGetBusinessTimeslotsForDays = (
  businessId: string,
  serviceId: string | null,
  dates: string[],
) => {
  const queries = useQueries({
    queries: dates.map((date) => ({
      queryKey: ["business", businessId, "timeslots", date, serviceId],
      queryFn: () => getBusinessTimeslots(businessId, date, serviceId!),
      enabled: !!businessId && !!serviceId,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    })),
  });

  const unavailableDates = new Set<string>();
  queries.forEach((query, index) => {
    if (query.isSuccess && (!query.data || query.data.length === 0)) {
      unavailableDates.add(dates[index]);
    }
  });

  return { unavailableDates, isLoading: queries.some((q) => q.isLoading) };
};

export default useGetBusinessTimeslotsForDays;
