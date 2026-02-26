// Business API Service
import { apiClient } from './client';
import type { ApiBusinessResponse } from './types';

/**
 * Fetch a single business by ID
 * @param businessId - The ID of the business to fetch
 * @returns Promise<ApiBusinessResponse>
 */
export const getBusinessById = async (businessId: string): Promise<ApiBusinessResponse> => {
  const response = await apiClient.get<ApiBusinessResponse>(`/business/${businessId}`);
  return response.data;
};

/**
 * Fetch all businesses (if endpoint exists)
 * @returns Promise<ApiBusinessResponse[]>
 */
export const getAllBusinesses = async (): Promise<ApiBusinessResponse[]> => {
  // Assuming there's a /business or /businesses endpoint
  // Update the endpoint path based on your actual API
  const response = await apiClient.get<ApiBusinessResponse[]>('/business');
  return response.data;
};

/**
 * Search/filter businesses (if endpoint exists)
 * @param filters - Optional filters (city, category, etc.)
 * @returns Promise<ApiBusinessResponse[]>
 */
export const searchBusinesses = async (filters?: {
  city?: string;
  category?: string;
  searchQuery?: string;
}): Promise<ApiBusinessResponse[]> => {
  // Update based on actual API endpoint and query params
  const response = await apiClient.get<ApiBusinessResponse[]>('/business', {
    params: filters,
  });
  return response.data;
};
