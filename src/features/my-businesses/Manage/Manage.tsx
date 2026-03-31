import PhotoManage from "@/features/my-businesses/Manage/dnd-photos/PhotoManage";
import ManageDelete from "@/features/my-businesses/Manage/ManageDelete";
import type { MyBusinessResponse } from "@/features/my-businesses/useGetMyBusinesses";

interface ManageBusinessProps {
  currentBusiness?: MyBusinessResponse;
}

export default function Manage({ currentBusiness }: ManageBusinessProps) {
  return (
    <>
      <PhotoManage currentBusiness={currentBusiness} />
      <ManageDelete currentBusiness={currentBusiness} />
    </>
  );
}
