import PhotoManage from "@/features/my-businesses/Manage/dnd-photos/PhotoManage";

export interface MyBusinessResponse {
  businessId: string;
  businessName: string;
  mainImage?: string;
  galleryImages?: string[];
}

interface ManageBusinessProps {
  currentBusiness?: MyBusinessResponse;
}

export default function Manage({ currentBusiness }: ManageBusinessProps) {
  return <PhotoManage currentBusiness={currentBusiness} />;
}
