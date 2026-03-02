// Mappers to convert API data to application format
import type { ApiBusinessResponse, ApiSchedule, ApiService, WeekDay } from './types';
import type { MockBusiness, MockWorkTime, MockService } from '../Booking/mockBusinesses';

/**
 * Convert API WeekDay enum to lowercase day name
 */
const weekDayToDay = (weekDay: WeekDay): string => {
  const mapping: Record<WeekDay, string> = {
    MON: 'monday',
    TUE: 'tuesday',
    WED: 'wednesday',
    THU: 'thursday',
    FRI: 'friday',
    SAT: 'saturday',
    SUN: 'sunday',
  };
  return mapping[weekDay];
};

/**
 * Convert API schedule to MockWorkTime
 */
const mapScheduleToWorkTime = (schedule: ApiSchedule): MockWorkTime => {
  return {
    day: weekDayToDay(schedule.weekDay),
    startTime: schedule.startTime,
    endTime: schedule.endTime,
  };
};

/**
 * Convert API service to MockService
 */
const mapApiServiceToMockService = (service: ApiService): MockService => {
  return {
    name: service.name,
    price: service.price,
    time: service.duration, // API uses 'duration', mock uses 'time'
    description: service.description,
  };
};

/**
 * Convert API business response to MockBusiness format
 * @param apiBusiness - Business data from API
 * @param businessId - Business ID (from API parameter)
 * @returns MockBusiness
 */
export const mapApiBusinessToMock = (
  apiBusiness: ApiBusinessResponse,
  businessId: string
): MockBusiness => {
  return {
    id: businessId,
    businessName: apiBusiness.businessName,
    callType: 'both', // Default value - API doesn't provide this
    city: 'თბილისი', // Default value - API doesn't provide this
    address: undefined, // API doesn't provide this
    description: apiBusiness.description,
    category: 'Other', // Default value - API doesn't provide this
    workTimes: apiBusiness.schedules.map(mapScheduleToWorkTime),
    restTimes: undefined, // API doesn't provide this
    services: apiBusiness.services.map(mapApiServiceToMockService),
    info: {
      phoneNumber: undefined, // API doesn't provide this
      instagramUrl: undefined, // API doesn't provide this
      facebookUrl: undefined, // API doesn't provide this
    },
    mainImageUrl: apiBusiness.businessPhoto,
    galleryImageUrls: [], // API only provides one photo
  };
};

/**
 * Convert array of API businesses to MockBusiness format
 */
export const mapApiBusinessesToMocks = (
  apiBusinesses: Array<{ id: string; data: ApiBusinessResponse }>
): MockBusiness[] => {
  return apiBusinesses.map((item) => mapApiBusinessToMock(item.data, item.id));
};
