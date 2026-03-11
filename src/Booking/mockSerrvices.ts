// mockServices.ts
// Mock "services" data aligned with your ServiceFormData fields,
// but images are URLs because FileList can't be represented in JSON.

export type MockService = {
  id: string;
  title: string;
  city: string;
  district?: string;
  description: string;
  address: string;

  // categoryId/subcategoryId in your form are category.name strings
  categoryId: string;
  subcategoryId?: string;

  estimatedTime?: string;

  price: number;
  priceMin?: number;
  priceMax?: number;

  websiteUrl?: string;
  email: string;
  facebookUrl?: string;
  instagramUrl?: string;

  // mock-friendly images
  mainImageUrl: string;
  galleryImageUrls?: string[];
};

export const mockServices: MockService[] = [
  {
    id: "1",
    title: "ქორწილის ფოტოგრაფია — სრული პაკეტი",
    city: "თბილისი",
    district: "ვაკე",
    description:
      "ქორწილის სრული დღის გადაღება, 2 ფოტოგრაფი, 400+ რეტუშირებული ფოტო, ონლაინ გალერეა და წინასწარი კონსულტაცია.",
    address: "ილ. ჭავჭავაძის გამზირი 45",
    categoryId: "Events",
    subcategoryId: "Photo and Video Production",
    estimatedTime: "8-10 საათი",
    price: 1200,
    priceMin: 900,
    priceMax: 1500,
    websiteUrl: "https://example.com/wedding-photo",
    email: "photo.studio@example.com",
    facebookUrl: "https://facebook.com/example.photo",
    instagramUrl: "https://instagram.com/example.photo",
    mainImageUrl: "https://picsum.photos/id/1062/800/600",
    galleryImageUrls: [
      "https://picsum.photos/id/1067/800/600",
      "https://picsum.photos/id/1059/800/600",
      "https://picsum.photos/id/1035/800/600",
    ],
  },
  {
    id: "2",
    title: "ბინის გენერალური დალაგება",
    city: "თბილისი",
    district: "საბურთალო",
    description:
      "გენერალური დალაგება 1-3 ოთახიან ბინებზე: სამზარეულო, აბაზანა, მტვრის სრული წმენდა, იატაკის დამუშავება და ნაგვის გატანა.",
    address: "ალ. ყაზბეგის გამზირი 18",
    categoryId: "Cleaning",
    subcategoryId: "Residential Cleaning",
    estimatedTime: "4-6 საათი",
    price: 120,
    priceMin: 80,
    priceMax: 200,
    websiteUrl: "https://example.com/cleaning",
    email: "clean.service@example.com",
    facebookUrl: "https://facebook.com/example.clean",
    instagramUrl: "https://instagram.com/example.clean",
    mainImageUrl: "https://picsum.photos/id/104/800/600",
    galleryImageUrls: ["https://picsum.photos/id/105/800/600"],
  },
  {
    id: "3",
    title: "მანქანის დეტეილინგი + სალონის ქიმწმენდა",
    city: "თბილისი",
    district: "გლდანი",
    description:
      "სრული დეტეილინგი: ხელით რეცხვა, პოლირება, დამცავი ცვილი, სალონის ქიმწმენდა, პლასტიკის მოვლა.",
    address: "ქერჩის ქუჩა 10",
    categoryId: "Auto Services",
    subcategoryId: "Car Wash and Polishing",
    estimatedTime: "1 დღე",
    price: 250,
    priceMin: 200,
    priceMax: 350,
    websiteUrl: "https://example.com/detailing",
    email: "auto.detail@example.com",
    facebookUrl: "https://facebook.com/example.auto",
    instagramUrl: "https://instagram.com/example.auto",
    mainImageUrl: "https://picsum.photos/id/1071/800/600",
    galleryImageUrls: [
      "https://picsum.photos/id/1072/800/600",
      "https://picsum.photos/id/1073/800/600",
    ],
  },
  {
    id: "4",
    title: "ინგლისურის ინდივიდუალური გაკვეთილები (A2–C1)",
    city: "ბათუმი",
    district: "ძველი ბათუმი",
    description:
      "კომუნიკაციის გაძლიერება, გრამატიკის სისტემატიზაცია, speaking practice და პერსონალური გეგმა. ონლაინ/ოფლაინ.",
    address: "მელაშვილის ქუჩა 7",
    categoryId: "Education",
    subcategoryId: "Foreign Language Teaching",
    estimatedTime: "60 წუთი",
    price: 40,
    websiteUrl: "https://example.com/english",
    email: "tutor.english@example.com",
    instagramUrl: "https://instagram.com/example.english",
    mainImageUrl: "https://picsum.photos/id/20/800/600",
    galleryImageUrls: ["https://picsum.photos/id/24/800/600"],
  },
  {
    id: "5",
    title: "ნამცხვრების შეკვეთა — დაბადების დღე / ივენთი",
    city: "ქუთაისი",
    district: "ცენტრი",
    description:
      "ინდივიდუალური დიზაინი, სხვადასხვა გემო, დროული მიწოდება ქალაქში. შესაძლებელია ალერგენების გათვალისწინება.",
    address: "რუსთაველის გამზირი 3",
    categoryId: "Events",
    subcategoryId: "Catering",
    estimatedTime: "24-48 საათი",
    price: 80,
    priceMin: 60,
    priceMax: 180,
    websiteUrl: "https://example.com/cakes",
    email: "cakes.order@example.com",
    facebookUrl: "https://facebook.com/example.cakes",
    instagramUrl: "https://instagram.com/example.cakes",
    mainImageUrl: "https://picsum.photos/id/1080/800/600",
    galleryImageUrls: [
      "https://picsum.photos/id/1081/800/600",
      "https://picsum.photos/id/1082/800/600",
    ],
  },
  {
    id: "6",
    title: "თმის კვეთა და სტაილინგი — ქალბატონებისთვის",
    city: "თბილისი",
    district: "ვაკე",
    description:
      "პროფესიონალური თმის კვეთა, სტაილინგი, ფენის საშრობით. გამოცდილი სტილისტი, თანამედროვე ტექნიკები.",
    address: "ჭავჭავაძის გამზირი 12",
    categoryId: "Beauty and Personal Care",
    subcategoryId: "Hair Care Services",
    estimatedTime: "1-2 საათი",
    price: 60,
    priceMin: 40,
    priceMax: 100,
    websiteUrl: "https://example.com/hair-salon",
    email: "hair.salon@example.com",
    instagramUrl: "https://instagram.com/example.hair",
    mainImageUrl: "https://picsum.photos/id/1027/800/600",
    galleryImageUrls: ["https://picsum.photos/id/1028/800/600"],
  },
  {
    id: "7",
    title: "მანიკიური და პედიკური — სრული პაკეტი",
    city: "თბილისი",
    district: "საბურთალო",
    description:
      "ხელების და ფეხების სრული მოვლა, გელ ლაქი, დიზაინი. ხარისხიანი მასალები და სტერილური ინსტრუმენტები.",
    address: "კოსტავას ქუჩა 25",
    categoryId: "Beauty and Personal Care",
    subcategoryId: "Nail Care Services",
    estimatedTime: "2-3 საათი",
    price: 80,
    priceMin: 60,
    priceMax: 120,
    email: "nails.beauty@example.com",
    instagramUrl: "https://instagram.com/example.nails",
    mainImageUrl: "https://picsum.photos/id/1074/800/600",
    galleryImageUrls: ["https://picsum.photos/id/1075/800/600"],
  },
  {
    id: "8",
    title: "სახის კოსმეტოლოგია — ანტი-ასაკოვანი პროცედურები",
    city: "თბილისი",
    district: "ვაკე",
    description:
      "პროფესიონალური სახის მოვლა, ბოტოქსი, ფილერები, მეზოთერაპია. ლიცენზირებული კოსმეტოლოგი.",
    address: "აბაშიძის ქუჩა 5",
    categoryId: "Beauty and Personal Care",
    subcategoryId: "Aesthetic Cosmetology",
    estimatedTime: "1 საათი",
    price: 200,
    priceMin: 150,
    priceMax: 400,
    websiteUrl: "https://example.com/cosmetology",
    email: "cosmetology@example.com",
    instagramUrl: "https://instagram.com/example.cosmetology",
    mainImageUrl: "https://picsum.photos/id/1076/800/600",
    galleryImageUrls: ["https://picsum.photos/id/1077/800/600"],
  },
  {
    id: "9",
    title: "მაკიაჟი ქორწილისთვის და ივენთებისთვის",
    city: "თბილისი",
    district: "დიდუბე",
    description:
      "პროფესიონალური მაკიაჟი ქორწილებისთვის, ფოტოსესიებისთვის, სპეციალური ივენთებისთვის. გამოსვლა მისამართზე.",
    address: "თემქას ქუჩა 8",
    categoryId: "Beauty and Personal Care",
    subcategoryId: "Makeup Services",
    estimatedTime: "1.5-2 საათი",
    price: 120,
    priceMin: 80,
    priceMax: 180,
    email: "makeup.artist@example.com",
    facebookUrl: "https://facebook.com/example.makeup",
    instagramUrl: "https://instagram.com/example.makeup",
    mainImageUrl: "https://picsum.photos/id/1078/800/600",
    galleryImageUrls: ["https://picsum.photos/id/1079/800/600"],
  },
  {
    id: "10",
    title: "SPA რელაქსაცია — სრული სხეულის მასაჟი",
    city: "ბათუმი",
    district: "ძველი ბათუმი",
    description:
      "ტრადიციული ქართული მასაჟი, სხეულის სრული რელაქსაცია, ეთერზეთები. სწრაფი სტრესის მოხსნა.",
    address: "ბარათაშვილის ქუჩა 15",
    categoryId: "Beauty and Personal Care",
    subcategoryId: "Spa and Relaxation Procedures",
    estimatedTime: "1-1.5 საათი",
    price: 100,
    priceMin: 70,
    priceMax: 150,
    websiteUrl: "https://example.com/spa",
    email: "spa.relax@example.com",
    instagramUrl: "https://instagram.com/example.spa",
    mainImageUrl: "https://picsum.photos/id/1084/800/600",
    galleryImageUrls: ["https://picsum.photos/id/1085/800/600"],
  },
];

// Optional helper: map a MockService into your form defaultValues shape
// (except images - those must be set via setValue with real FileList at runtime)
export function mockToFormDefaults(service: MockService) {
  return {
    title: service.title,
    city: service.city,
    district: service.district ?? "",
    description: service.description,
    address: service.address,
    categoryId: service.categoryId,
    subcategoryId: service.subcategoryId ?? "",
    estimatedTime: service.estimatedTime ?? "",
    price: service.price,
    priceMin: service.priceMin,
    priceMax: service.priceMax,
    websiteUrl: service.websiteUrl ?? "",
    email: service.email,
    facebookUrl: service.facebookUrl ?? "",
    instagramUrl: service.instagramUrl ?? "",
  };
}
