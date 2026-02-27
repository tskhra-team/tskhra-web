// React Query hooks for business data fetching
import { useQuery } from '@tanstack/react-query';
import { getBusinessById, getAllBusinesses } from '../businessService';
import { mapApiBusinessToMock } from '../mappers';
import type { MockBusiness } from '../../Booking/mockBusinesses';

/**
 * Hook to fetch a single business by ID
 * @param businessId - The ID of the business to fetch
 * @returns React Query result with business data
 */
export const useBusiness = (businessId: string) => {
  return useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      const apiData = await getBusinessById(businessId);
      return mapApiBusinessToMock(apiData, businessId);
    },
    enabled: !!businessId, // Only fetch if businessId is provided
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
  });
};

/**
 * Hook to fetch all businesses
 * @returns React Query result with array of businesses
 */
export const useBusinesses = () => {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const apiBusinesses = await getAllBusinesses();
      // Map API data to mock format
      // Note: We need IDs from the API - update this based on actual API response
      return apiBusinesses.map((business, index) =>
        mapApiBusinessToMock(business, String(index + 1))
      );
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
  });
};

/**
 * Hook to get business data with fallback to mock data
 * Useful during development or when API is unavailable
 */
export const useBusinessWithFallback = (businessId: string, fallbackData?: MockBusiness) => {
  return useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      const apiData = await getBusinessById(businessId);
      return mapApiBusinessToMock(apiData, businessId);
    },
    enabled: !!businessId,
    placeholderData: fallbackData, // Use mock data while loading
    staleTime: 5 * 60 * 1000,
  });
};
