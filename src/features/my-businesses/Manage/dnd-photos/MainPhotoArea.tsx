import { PhotoCard } from "@/features/my-businesses/Manage/dnd-photos/PhotoCard";
import { useDraggable, useDroppable } from "@dnd-kit/core";

interface MainPhotoAreaProps {
  mainPhoto?: string;
  mainPhotoId?: string;
  isEditMode: boolean;
}

export function MainPhotoArea({
  mainPhoto,
  mainPhotoId,
  isEditMode,
}: MainPhotoAreaProps) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: "main-photo-dropzone",
    disabled: !isEditMode,
  });

  const {
    setNodeRef: setDragRef,
    attributes,
    listeners,
    isDragging,
  } = useDraggable({
    id: mainPhotoId || "empty-main",
    disabled: !isEditMode || !mainPhoto,
  });

  const showDropOverlay = isOver && !isDragging && isEditMode;

  return (
    <div
      ref={setDropRef}
      className={`relative w-full aspect-video md:aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
        showDropOverlay
          ? "border-emerald-500 bg-emerald-50"
          : "border-dashed border-slate-200 bg-slate-50/50"
      }`}
    >
      {mainPhoto ? (
        <div
          ref={setDragRef}
          {...listeners}
          {...attributes}
          className={`w-full h-full touch-none ${
            isEditMode
              ? "cursor-grab active:cursor-grabbing"
              : "cursor-default"
          }`}
        >
          <PhotoCard
            url={mainPhoto}
            isDragging={isDragging}
            label="MAIN PHOTO"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <p className="text-sm font-medium">
            {isEditMode
              ? "Drag photo here to set as main"
              : "No main photo"}
          </p>
        </div>
      )}

      {showDropOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 backdrop-blur-[2px] z-20 pointer-events-none">
          <p className="text-emerald-700 font-bold text-sm bg-white px-4 py-2 rounded-full shadow-lg">
            Drop to set as Main
          </p>
        </div>
      )}
    </div>
  );
}
