import type { CategoryItem } from "./types";

type Props = {
  categories: CategoryItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function CategoryNav({
  categories,
  activeIndex,
  onSelect,
}: Props) {
  return (
    <ul className="w-70 space-y-1 ">
      {categories.map((cat, i) => {
        const active = i === activeIndex;

        return (
          <li key={cat.name}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left  ",
                active ? "bg-black text-white" : "hover:bg-gray-100",
              ].join(" ")}
            >
              <img
                className="h-6 w-6"
                src={cat.iconUrl || "/default-icon.png"}
                alt={cat.name}
              />
              <span className="text-sm font-medium">{cat.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
