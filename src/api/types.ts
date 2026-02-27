// API Type Definitions based on Swagger API

export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface ApiService {
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

export interface ApiSchedule {
  weekDay: WeekDay;
  startTime: number; // minutes from midnight
  endTime: number;
}

export interface ApiBusinessResponse {
  businessName: string;
  businessPhoto: string;
  description: string | null;
  services: ApiService[];
  schedules: ApiSchedule[];
}

export interface ApiBusinessListResponse {
  businesses: ApiBusinessResponse[];
}
