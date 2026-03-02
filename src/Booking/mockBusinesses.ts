// mockBusinesses.ts
// Mock business data aligned with IndividualBusinessFormData schema

export type MockWorkTime = {
  day: string;
  startTime: number; // minutes from midnight (0-1440)
  endTime: number;
};

export type MockService = {
  name: string;
  price: number;
  time: number; // duration in minutes
  description?: string;
};

export type MockBusinessInfo = {
  phoneNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
};

export type MockBusiness = {
  id: string;
  businessName: string;
  callType: "outcall" | "onsite" | "both";
  city: string;
  address?: string;
  description?: string | null;
  category: string;
  workTimes: MockWorkTime[];
  restTimes?: MockWorkTime[];
  services: MockService[];
  info: MockBusinessInfo;

  // Additional fields for display
  mainImageUrl: string;
  galleryImageUrls?: string[];
};

// Helper function to convert minutes to time string
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Helper to get day name in Georgian
export function getDayName(day: string): string {
  const dayNames: Record<string, string> = {
    monday: "ორშაბათი",
    tuesday: "სამშაბათი",
    wednesday: "ოთხშაბათი",
    thursday: "ხუთშაბათი",
    friday: "პარასკევი",
    saturday: "შაბათი",
    sunday: "კვირა",
  };
  return dayNames[day.toLowerCase()] || day;
}

export const mockBusinesses: MockBusiness[] = [
  {
    id: "1",
    businessName: "ფოტო სტუდია 'მომენტი'",
    callType: "both",
    city: "თბილისი",
    address: "ილ. ჭავჭავაძის გამზირი 45",
    description:
      "პროფესიონალური ფოტო სერვისები ქორწილებისთვის, ივენთებისთვის და პორტრეტული გადაღებები. 10 წლიანი გამოცდილება და მაღალი ხარისხის აღჭურვილობა.",
    category: "Photography",
    workTimes: [
      { day: "monday", startTime: 540, endTime: 1080 }, // 09:00 - 18:00
      { day: "tuesday", startTime: 540, endTime: 1080 },
      { day: "wednesday", startTime: 540, endTime: 1080 },
      { day: "thursday", startTime: 540, endTime: 1080 },
      { day: "friday", startTime: 540, endTime: 1080 },
      { day: "saturday", startTime: 600, endTime: 960 }, // 10:00 - 16:00
    ],
    services: [
      {
        name: "ქორწილის სრული პაკეტი",
        price: 1200,
        time: 480,
        description: "8-10 საათი გადაღება, 2 ფოტოგრაფი, 400+ ფოტო",
      },
      {
        name: "ივენთის გადაღება",
        price: 500,
        time: 240,
        description: "დაბადების დღე, კორპორატიული ივენთი",
      },
      {
        name: "პორტრეტული სესია",
        price: 150,
        time: 60,
        description: "სტუდიაში ან გარეთ, 30+ რეტუშირებული ფოტო",
      },
    ],
    info: {
      phoneNumber: "+995 555 123 456",
      instagramUrl: "https://instagram.com/photo.momenti",
      facebookUrl: "https://facebook.com/photo.momenti",
    },
    mainImageUrl: "https://picsum.photos/id/1062/800/600",
    galleryImageUrls: [
      "https://picsum.photos/id/1067/800/600",
      "https://picsum.photos/id/1059/800/600",
      "https://picsum.photos/id/1035/800/600",
    ],
  },
  {
    id: "2",
    businessName: "დასუფთავების სერვისი 'სისუფთავე'",
    callType: "outcall",
    city: "თბილისი",
    address: "ალ. ყაზბეგის გამზირი 18",
    description:
      "გენერალური დალაგება, ოფისების დალაგება, პოსტ-რემონტის დალაგება. პროფესიონალური გუნდი და ეკოლოგიური საშუალებები.",
    category: "Cleaning",
    workTimes: [
      { day: "monday", startTime: 480, endTime: 1140 }, // 08:00 - 19:00
      { day: "tuesday", startTime: 480, endTime: 1140 },
      { day: "wednesday", startTime: 480, endTime: 1140 },
      { day: "thursday", startTime: 480, endTime: 1140 },
      { day: "friday", startTime: 480, endTime: 1140 },
      { day: "saturday", startTime: 540, endTime: 900 }, // 09:00 - 15:00
    ],
    services: [
      {
        name: "გენერალური დალაგება",
        price: 120,
        time: 300,
        description: "1-3 ოთახიანი ბინა, სრული წმენდა",
      },
      {
        name: "ოფისის დალაგება",
        price: 200,
        time: 180,
        description: "დამატებითი სამუშაო სივრცეების მომსახურება",
      },
      {
        name: "ფანჯრების დალაგება",
        price: 50,
        time: 120,
        description: "სტანდარტული ბინის ყველა ფანჯარა",
      },
    ],
    info: {
      phoneNumber: "+995 599 987 654",
      instagramUrl: "https://instagram.com/sisupthave.clean",
    },
    mainImageUrl: "https://picsum.photos/id/104/800/600",
    galleryImageUrls: ["https://picsum.photos/id/105/800/600"],
  },
  {
    id: "3",
    businessName: "ავტო დეტეილინგი 'პრო კეა'",
    callType: "onsite",
    city: "თბილისი",
    address: "ქერჩის ქუჩა 10",
    description:
      "სრული ავტომობილის დეტეილინგი და ქიმწმენდა. თანამედროვე აღჭურვილობა და პრემიუმ საშუალებები თქვენი მანქანის მოვლისთვის.",
    category: "AutoService",
    workTimes: [
      { day: "monday", startTime: 540, endTime: 1080 }, // 09:00 - 18:00
      { day: "tuesday", startTime: 540, endTime: 1080 },
      { day: "wednesday", startTime: 540, endTime: 1080 },
      { day: "thursday", startTime: 540, endTime: 1080 },
      { day: "friday", startTime: 540, endTime: 1080 },
      { day: "saturday", startTime: 600, endTime: 1020 }, // 10:00 - 17:00
      { day: "sunday", startTime: 600, endTime: 900 }, // 10:00 - 15:00
    ],
    services: [
      {
        name: "სრული დეტეილინგი",
        price: 250,
        time: 480,
        description: "ხელით რეცხვა, პოლირება, ცვილი, ქიმწმენდა",
      },
      {
        name: "სალონის ქიმწმენდა",
        price: 80,
        time: 180,
        description: "სავარძლები, იატაკი, პლასტიკის მოვლა",
      },
      {
        name: "გარე რეცხვა + ცვილი",
        price: 50,
        time: 90,
        description: "ხელით რეცხვა და დამცავი ცვილის დაფარვა",
      },
    ],
    info: {
      phoneNumber: "+995 577 456 789",
      instagramUrl: "https://instagram.com/prokea.detailing",
      facebookUrl: "https://facebook.com/prokea.auto",
    },
    mainImageUrl: "https://picsum.photos/id/1071/800/600",
    galleryImageUrls: [
      "https://picsum.photos/id/1072/800/600",
      "https://picsum.photos/id/1073/800/600",
    ],
  },
  {
    id: "4",
    businessName: "ინგლისურის სკოლა 'სპიკ ფლუენტლი'",
    callType: "both",
    city: "ბათუმი",
    address: "მელაშვილის ქუჩა 7",
    description:
      "ინგლისურის ინდივიდუალური და ჯგუფური გაკვეთილები ყველა დონისთვის. ონლაინ და ოფლაინ ფორმატი, გამოცდილი პედაგოგები.",
    category: "Education",
    workTimes: [
      { day: "monday", startTime: 600, endTime: 1260 }, // 10:00 - 21:00
      { day: "tuesday", startTime: 600, endTime: 1260 },
      { day: "wednesday", startTime: 600, endTime: 1260 },
      { day: "thursday", startTime: 600, endTime: 1260 },
      { day: "friday", startTime: 600, endTime: 1260 },
      { day: "saturday", startTime: 540, endTime: 1080 }, // 09:00 - 18:00
    ],
    services: [
      {
        name: "ინდივიდუალური გაკვეთილი",
        price: 40,
        time: 60,
        description: "პერსონალური გეგმა, speaking practice",
      },
      {
        name: "ჯგუფური გაკვეთილი",
        price: 25,
        time: 90,
        description: "მინი ჯგუფი (3-5 ადამიანი)",
      },
      {
        name: "ინტენსიური კურსი",
        price: 300,
        time: 1200,
        description: "1 თვე, 20 საათი, ყველა დონე",
      },
    ],
    info: {
      phoneNumber: "+995 591 234 567",
      instagramUrl: "https://instagram.com/speakfluently.ge",
    },
    mainImageUrl: "https://picsum.photos/id/20/800/600",
    galleryImageUrls: ["https://picsum.photos/id/24/800/600"],
  },
  {
    id: "5",
    businessName: "ნამცხვრების შემოქმედება 'ტკბილი დღე'",
    callType: "outcall",
    city: "ქუთაისი",
    address: "რუსთაველის გამზირი 3",
    description:
      "ხელნაკეთი ნამცხვრები ინდივიდუალური დიზაინით. დაბადების დღეები, ქორწილები, კორპორატიული ივენთები. ალერგენების გათვალისწინება.",
    category: "Food",
    workTimes: [
      { day: "tuesday", startTime: 600, endTime: 1080 }, // 10:00 - 18:00
      { day: "wednesday", startTime: 600, endTime: 1080 },
      { day: "thursday", startTime: 600, endTime: 1080 },
      { day: "friday", startTime: 600, endTime: 1080 },
      { day: "saturday", startTime: 540, endTime: 960 }, // 09:00 - 16:00
      { day: "sunday", startTime: 600, endTime: 900 }, // 10:00 - 15:00
    ],
    restTimes: [
      { day: "tuesday", startTime: 780, endTime: 840 }, // 13:00 - 14:00 lunch break
      { day: "wednesday", startTime: 780, endTime: 840 },
      { day: "thursday", startTime: 780, endTime: 840 },
      { day: "friday", startTime: 780, endTime: 840 },
    ],
    services: [
      {
        name: "დაბადების დღის ნამცხვარი",
        price: 80,
        time: 2880,
        description: "ინდივიდუალური დიზაინი, სხვადასხვა გემო",
      },
      {
        name: "ქორწილის ნამცხვარი",
        price: 250,
        time: 4320,
        description: "მრავალ-იარუსიანი, ელეგანტური დიზაინი",
      },
      {
        name: "მინი დესერტები",
        price: 35,
        time: 1440,
        description: "12 ცალი, ასორტი (კაპკეიქები, მაკარონები)",
      },
    ],
    info: {
      phoneNumber: "+995 568 876 543",
      instagramUrl: "https://instagram.com/sweetday.cakes",
      facebookUrl: "https://facebook.com/sweetday.kutaisi",
    },
    mainImageUrl: "https://picsum.photos/id/1080/800/600",
    galleryImageUrls: [
      "https://picsum.photos/id/1081/800/600",
      "https://picsum.photos/id/1082/800/600",
    ],
  },
];
