import { Button } from "@/components/ui/button";
import { Check, Pencil, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import useUploadBusinessPhotos from "@/features/business-creation/booking-business/useUploadBusinessPhotos";
import { MainPhotoArea } from "@/features/my-businesses/Manage/dnd-photos/MainPhotoArea";
import { SortablePhoto } from "@/features/my-businesses/Manage/dnd-photos/SortablePhoto";
import type { MyBusinessResponse } from "@/features/my-businesses/useGetMyBusinesses";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  defaultDropAnimation,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type Modifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

interface PhotoItem {
  id: string;
  url: string;
  file?: File;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Модификатор: оверлей сразу центрируется на курсоре, без прыжка из угла
const snapCenterToCursor: Modifier = ({
  activatorEvent,
  draggingNodeRect,
  transform,
}) => {
  if (draggingNodeRect && activatorEvent) {
    const event = activatorEvent as PointerEvent | TouchEvent;
    const coords =
      "touches" in event
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
        : {
            x: (event as PointerEvent).clientX,
            y: (event as PointerEvent).clientY,
          };

    const offsetX = coords.x - draggingNodeRect.left;
    const offsetY = coords.y - draggingNodeRect.top;

    return {
      ...transform,
      x: transform.x + offsetX - draggingNodeRect.width / 2,
      y: transform.y + offsetY - draggingNodeRect.height / 2,
    };
  }
  return transform;
};

function createPhotoItem(url: string, file?: File): PhotoItem {
  return { id: crypto.randomUUID(), url, file };
}

function buildPhotosFromBusiness(business?: MyBusinessResponse): {
  main: PhotoItem | null;
  gallery: PhotoItem[];
} {
  const main = business?.mainImage ? createPhotoItem(business.mainImage) : null;
  const gallery = (business?.galleryImages ?? []).map((url) =>
    createPhotoItem(url),
  );
  return { main, gallery };
}

interface ManageBusinessProps {
  currentBusiness?: MyBusinessResponse;
}

export default function PhotoManage({ currentBusiness }: ManageBusinessProps) {
  const initial = buildPhotosFromBusiness(currentBusiness);
  const [mainPhoto, setMainPhoto] = useState<PhotoItem | null>(initial.main);
  const [galleryPhotos, setGalleryPhotos] = useState<PhotoItem[]>(
    initial.gallery,
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isPending: isUploading } = useUploadBusinessPhotos();

  // Синхронизация с props при смене бизнеса
  useEffect(() => {
    const next = buildPhotosFromBusiness(currentBusiness);
    setMainPhoto(next.main);
    setGalleryPhotos(next.gallery);
    setIsEditMode(false);
  }, [currentBusiness?.businessId]);

  // Сенсоры: pointer + touch
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  // --- Handlers ---

  const handleRemovePhoto = (id: string) => {
    setGalleryPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo?.file) URL.revokeObjectURL(photo.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = 4 - galleryPhotos.length;
    if (remaining <= 0) {
      toast.warning("You can add only 4 photos in gallery", {
        position: "top-center",
      });
      return;
    }

    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File "${file.name}" is too large. Maximum size is 5MB`, {
          position: "top-center",
        });
        continue;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error(
          `File "${file.name}" has invalid type. Only JPG, PNG and WebP are allowed`,
          { position: "top-center" },
        );
        continue;
      }
      validFiles.push(file);
    }

    const toAdd = validFiles.slice(0, remaining);
    if (toAdd.length < validFiles.length) {
      toast.warning(`Only ${remaining} photo(s) can be added`, {
        position: "top-center",
      });
    }

    const newItems = toAdd.map((file) =>
      createPhotoItem(URL.createObjectURL(file), file),
    );
    setGalleryPhotos((prev) => [...prev, ...newItems]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    // Revoke object URLs for new photos
    galleryPhotos.forEach((p) => {
      if (p.file) URL.revokeObjectURL(p.url);
    });
    if (mainPhoto?.file) URL.revokeObjectURL(mainPhoto.url);

    const original = buildPhotosFromBusiness(currentBusiness);
    setMainPhoto(original.main);
    setGalleryPhotos(original.gallery);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    toast.warning("Photo saving feature is in developing stage", {
      position: "top-center",
    });

    // if (!currentBusiness?.businessId) return;
    // // Все фото в порядке: main первый (index 0 → isMain: true в хуке), затем gallery по #
    // const allPhotos: PhotoItem[] = [];
    // if (mainPhoto) allPhotos.push(mainPhoto);
    // allPhotos.push(...galleryPhotos);
    // if (allPhotos.length === 0) {
    //   setIsEditMode(false);
    //   return;
    // }
    // try {
    //   const files: File[] = await Promise.all(
    //     allPhotos.map(async (photo) => {
    //       // Новое фото — уже File
    //       if (photo.file) return photo.file;
    //       // Существующее фото — скачиваем URL и конвертируем в File
    //       const response = await fetch(photo.url);
    //       const blob = await response.blob();
    //       const fileName =
    //         photo.url.split("/").pop() || `photo-${photo.id}.jpg`;
    //       return new File([blob], fileName, {
    //         type: blob.type || "image/jpeg",
    //       });
    //     }),
    //   );
    //   uploadPhotos(
    //     { data: files, businessId: currentBusiness.businessId },
    //     {
    //       onSuccess: () => {
    //         toast.success("Photos saved successfully", {
    //           position: "top-center",
    //         });
    //         setIsEditMode(false);
    //       },
    //       onError: () => {
    //         toast.error("Failed to save photos", {
    //           position: "top-center",
    //         });
    //       },
    //     },
    //   );
    // } catch {
    //   toast.error("Failed to process photos", {
    //     position: "top-center",
    //   });
    // }
  };

  // --- DnD Handlers ---

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const findPhotoUrl = (id: string): string | undefined => {
    if (mainPhoto?.id === id) return mainPhoto.url;
    return galleryPhotos.find((p) => p.id === id)?.url;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const draggedId = active.id as string;
    const dropTargetId = over.id as string;

    if (draggedId === dropTargetId) return;

    const isDroppedOnMain =
      dropTargetId === "main-photo-dropzone" || dropTargetId === mainPhoto?.id;

    // --- Gallery → Main ---
    if (isDroppedOnMain && draggedId !== mainPhoto?.id) {
      const draggedPhoto = galleryPhotos.find((p) => p.id === draggedId);
      if (!draggedPhoto) return;

      const oldMain = mainPhoto;
      setMainPhoto(draggedPhoto);
      setGalleryPhotos((prev) => {
        const filtered = prev.filter((p) => p.id !== draggedId);
        return oldMain ? [...filtered, oldMain] : filtered;
      });
      return;
    }

    // --- Main → Gallery (swap) ---
    if (
      draggedId === mainPhoto?.id &&
      galleryPhotos.some((p) => p.id === dropTargetId)
    ) {
      const targetPhoto = galleryPhotos.find((p) => p.id === dropTargetId)!;
      const oldMain = mainPhoto;

      setMainPhoto(targetPhoto);
      setGalleryPhotos((prev) =>
        prev.map((p) => (p.id === targetPhoto.id ? oldMain : p)),
      );
      return;
    }

    // --- Gallery → Gallery (reorder) ---
    if (
      galleryPhotos.some((p) => p.id === draggedId) &&
      galleryPhotos.some((p) => p.id === dropTargetId)
    ) {
      setGalleryPhotos((prev) => {
        const oldIndex = prev.findIndex((p) => p.id === draggedId);
        const newIndex = prev.findIndex((p) => p.id === dropTargetId);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mt-10 px-4 md:px-6 max-w-5xl mx-auto">
        {/* Кнопки управления */}
        <div className="flex justify-end gap-3 mb-6">
          {!isEditMode ? (
            <Button
              variant="outline"
              onClick={() => setIsEditMode(true)}
              className="gap-2"
            >
              <Pencil className="w-4 h-4" />
              Change Photos
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isUploading}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              {galleryPhotos.length < 4 && (
                <Button
                  variant="outline"
                  onClick={handleAddPhoto}
                  disabled={isUploading}
                  className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <Plus className="w-4 h-4" />
                  Add Photo
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={isUploading}
                className="gap-2 bg-linear-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800"
              >
                <Check className="w-4 h-4" />
                {isUploading ? "Saving..." : "Save"}
              </Button>
            </>
          )}
        </div>

        {/* Сетка фото */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* ЛЕВАЯ ЧАСТЬ: Главное фото */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-[0.2em]">
              Main Visual
            </h3>
            <MainPhotoArea
              mainPhoto={mainPhoto?.url}
              mainPhotoId={mainPhoto?.id}
              isEditMode={isEditMode}
            />
          </div>

          {/* ПРАВАЯ ЧАСТЬ: Галерея */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-[0.2em]">
              Gallery ({galleryPhotos.length}/4)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <SortableContext
                items={galleryPhotos.map((p) => p.id)}
                strategy={rectSortingStrategy}
              >
                {galleryPhotos.map((photo, index) => (
                  <SortablePhoto
                    key={photo.id}
                    id={photo.id}
                    index={index}
                    url={photo.url}
                    onRemove={() => handleRemovePhoto(photo.id)}
                    isEditMode={isEditMode}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ОВЕРЛЕЙ: То, что "летает" за курсором */}
      <DragOverlay
        dropAnimation={defaultDropAnimation}
        modifiers={[snapCenterToCursor]}
      >
        {activeId ? (
          <div className="w-32 h-32 md:w-40 md:h-40 shadow-2xl ring-4 ring-emerald-500 rounded-xl overflow-hidden rotate-3 cursor-grabbing opacity-90">
            <img
              src={findPhotoUrl(activeId)}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
