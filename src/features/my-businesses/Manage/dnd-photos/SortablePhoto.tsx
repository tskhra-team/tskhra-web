import { PhotoCard } from "@/features/my-businesses/Manage/dnd-photos/PhotoCard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortablePhoto({
  id,
  index,
  url,
  onRemove,
}: {
  id: string;
  index: number;
  url: string;
  onRemove: () => void;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

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
      className="relative aspect-square cursor-grab active:cursor-grabbing touch-none z-10"
    >
      <PhotoCard
        url={url}
        index={index}
        isDragging={isDragging}
        onRemove={onRemove}
        showBadge
      />
    </div>
  );
}
