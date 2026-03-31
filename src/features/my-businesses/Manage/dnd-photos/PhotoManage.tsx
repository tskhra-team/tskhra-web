import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

import { MainPhotoArea } from "@/features/my-businesses/Manage/dnd-photos/MainPhotoArea";
import { SortablePhoto } from "@/features/my-businesses/Manage/dnd-photos/SortablePhoto";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

export interface MyBusinessResponse {
  businessId: string;
  businessName: string;
  mainImage?: string;
  galleryImages?: string[];
}

interface ManageBusinessProps {
  currentBusiness?: MyBusinessResponse;
}

export default function PhotoManage({ currentBusiness }: ManageBusinessProps) {
  const [mainPhoto, setMainPhoto] = useState<string | undefined>(
    currentBusiness?.mainImage,
  );
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>(
    currentBusiness?.galleryImages ?? [],
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  // Сенсоры: активация драга только после сдвига на 8px (защита от случайных кликов)
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const sensors = useSensors(pointerSensor);

  const handleRemovePhoto = (url: string) => {
    setGalleryPhotos((prev) => prev.filter((p) => p !== url));
  };

  const handleAddPhoto = () => {
    if (galleryPhotos.length >= 4) return;
    const mockUrl = `https://picsum.photos/seed/${Math.random()}/400/400`;
    setGalleryPhotos((prev) => [...prev, mockUrl]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return; // Если бросили за пределами зон

    const draggedId = active.id as string;
    const dropTargetId = over.id as string;

    // Если фото бросили само на себя
    if (draggedId === dropTargetId) return;

    // Проверяем, бросили ли фото в зону главного фото (на сам контейнер или на текущее фото внутри него)
    const isDroppedOnMain =
      dropTargetId === "main-photo-dropzone" || dropTargetId === mainPhoto;

    // --- ЛОГИКА 1: Галерея -> Главное фото ---
    if (isDroppedOnMain && draggedId !== mainPhoto) {
      const oldMain = mainPhoto;
      setMainPhoto(draggedId);
      setGalleryPhotos((prev) => {
        const filtered = prev.filter((url) => url !== draggedId);
        return oldMain ? [...filtered, oldMain] : filtered;
      });
      return;
    }

    // --- ЛОГИКА 2: Главное фото -> Галерея (Обмен местами) ---
    if (draggedId === mainPhoto && galleryPhotos.includes(dropTargetId)) {
      const oldMain = mainPhoto;
      const newMain = dropTargetId; // Фото из галереи, над которым отпустили

      setMainPhoto(newMain);
      setGalleryPhotos((prev) =>
        prev.map((url) => (url === newMain ? oldMain : url)),
      );
      return;
    }

    // --- ЛОГИКА 3: Галерея -> Галерея (Сортировка) ---
    if (
      galleryPhotos.includes(draggedId) &&
      galleryPhotos.includes(dropTargetId)
    ) {
      setGalleryPhotos((prev) => {
        const oldIndex = prev.indexOf(draggedId);
        const newIndex = prev.indexOf(dropTargetId);
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
      <div className="mt-10 px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
        {/* ЛЕВАЯ ЧАСТЬ: Главное фото */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-[0.2em]">
            Main Visual
          </h3>
          <MainPhotoArea mainPhoto={mainPhoto} />
        </div>

        {/* ПРАВАЯ ЧАСТЬ: Галерея */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-[0.2em]">
              Gallery ({galleryPhotos.length}/4)
            </h3>
            {galleryPhotos.length < 4 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddPhoto}
                className="h-8 gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <Plus className="w-4 h-4" /> Add Photo
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SortableContext
              items={galleryPhotos}
              strategy={rectSortingStrategy}
            >
              {galleryPhotos.map((url, index) => (
                <SortablePhoto
                  key={url}
                  id={url}
                  index={index}
                  url={url}
                  onRemove={() => handleRemovePhoto(url)}
                />
              ))}
            </SortableContext>
          </div>
        </div>
      </div>

      {/* ОВЕРЛЕЙ: То, что "летает" за курсором */}
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div className="w-32 h-32 md:w-40 md:h-40 shadow-2xl ring-4 ring-emerald-500 rounded-xl overflow-hidden rotate-3 cursor-grabbing opacity-90">
            <img src={activeId} alt="" className="w-full h-full object-cover" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
