import { PhotoCard } from "@/features/my-businesses/Manage/dnd-photos/PhotoCard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortablePhoto({
  id,
  index,
  url,
  onRemove,
  isEditMode,
}: {
  id: string;
  index: number;
  url: string;
  onRemove?: () => void;
  isEditMode: boolean;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative aspect-square touch-none z-10 ${
        isEditMode
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-default"
      }`}
    >
      <PhotoCard
        url={url}
        index={index}
        isDragging={isDragging}
        onRemove={isEditMode ? onRemove : undefined}
        showBadge
      />
    </div>
  );
}
