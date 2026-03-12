export type WorkTime = {
  weekDay: string | number;
  startTime: number;
  endTime: number;
};

export type RestTime = {
  weekDay: string | number;
  startTime: number;
  endTime: number;
};

export type BusinessInfo = {
  phoneNumber: string;
  instagramUrl: string;
  facebookUrl: string;
};

export type Business = {
  businessId: string;
  businessName: string;
  businessPhoto: string;
  description: string | null;
  mainImage: string;
  callType: string;
  city: string;
  category: string;
  info: BusinessInfo;
  addressDetail: string;
  workTimes: WorkTime[];
  restTimes: RestTime[];
  galleryImages: string[];
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: "ACTIVE" | "INACTIVE"
};

export type AvailableDay = {
  date: Date;
  dateString: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isAvailable: boolean;
};

export type TimeSlot = {
  time: string;
  isAvailable: boolean;
};
