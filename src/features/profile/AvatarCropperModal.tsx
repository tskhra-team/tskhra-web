import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCroppedImg } from "@/utils";
import { useState } from "react";
import Cropper from "react-easy-crop";
import { toast } from "sonner";

interface AvatarCropperModalProps {
  imageSrc: string | null;
  onClose: () => void;
  onSave: (croppedFile: File) => Promise<void> | void;
}

export default function AvatarCropperModal({
  imageSrc,
  onClose,
  onSave,
}: AvatarCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onCropComplete = (
    _croppedArea: unknown,
    croppedAreaPixels: { x: number; y: number; width: number; height: number },
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        await onSave(croppedFile);
      }
      onClose();
    } catch (e) {
      toast.error(`Cropping Error: ${e}`, { position: "top-center" });
    }
  };

  return (
    <Dialog open={!!imageSrc} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-xl h-125 flex flex-col p-4">
        <DialogHeader>
          <DialogTitle>Crop photo</DialogTitle>
        </DialogHeader>
        <div className="relative flex-1 bg-black rounded-md overflow-hidden mt-2">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </div>
        <DialogFooter className="mt-4 justify-between sm:justify-end flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto cursor-pointer"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
