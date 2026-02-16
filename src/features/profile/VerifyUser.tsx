import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useGetProfile from "@/features/profile/useGetProfile";
import useVerify from "@/features/profile/useVerify";
import queryClient from "@/query/queryClient";
import { ShieldCheck, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type VerifyUserProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function VerifyUser({ open, onOpenChange }: VerifyUserProps) {
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const { mutate: verifyUser, isPending } = useVerify();
  const { refetch } = useGetProfile();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <div className="flex flex-col py-4">
          <div className="relative mb-6 flex justify-center">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative p-4 bg-linear-to-br from-green-500 to-green-600 rounded-full shadow-lg">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
          </div>

          <DialogHeader className="space-y-4 text-center">
            <DialogTitle className="text-xl text-center md:text-2xl font-bold bg-linear-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              ვერიფიკაცია
            </DialogTitle>
            <DialogDescription className="text-base text-center md:text-lg text-gray-600 leading-relaxed px-2">
              გთხოვთ ატვირთოთ თქვენი პირადობის დამადასტურებელი დოკუმენტი
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                პირადობის მოწმობა / პასპორტი
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setIdDocument(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              {idDocument && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {idDocument.name}
                </p>
              )}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    რა დოკუმენტები მიიღება?
                  </p>
                  <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                    <li>პირადობის მოწმობა</li>
                    <li>პასპორტი</li>
                    <li>მართვის მოწმობა</li>
                  </ul>
                </div>
              </div>
              <p className="mt-10 text-sm font-bold text-blue-700">
                *ჩვენ არ ვინახავთ თქვენ პირად მონაცემებს, ეს პროცედურა თქვენი
                იდენტიფიცირებისთვის არის აუცილებელი.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-8 flex-col-reverse sm:flex-row gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
              >
                გაუქმება
              </Button>
            </DialogClose>
            <Button
              disabled={!idDocument || isPending}
              className="w-full sm:w-auto bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                verifyUser(undefined, {
                  onSuccess: () => {
                    toast.success("ვერიფიკაციის მოთხოვნა წარმატებით გაიგზავნა!", {
                      position: "top-center",
                    });
                    refetch();
                    queryClient.invalidateQueries({
                      queryKey: ["getUser"],
                    });
                    setIdDocument(null);
                    onOpenChange(false);
                  },
                  onError: () => {
                    toast.error("დაფიქსირდა შეცდომა, გთხოვთ სცადოთ თავიდან", {
                      position: "top-center",
                    });
                  },
                });
              }}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              {isPending ? "იგზავნება..." : "გაგზავნა"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
