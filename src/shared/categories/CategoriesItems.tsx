import type { CategoryItem } from "./types";

function Node({ item }: { item: CategoryItem }) {
  const hasChildren = !!item.childItems?.length;

  if (hasChildren) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold">{item.name}</p>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {item.childItems!.map((child) => (
            <Node key={child.name} item={child} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <a
      href={item.url || "#"}
      className="group rounded-2xl border bg-white p-4 hover:shadow-sm"
    >
      <p className="text-sm font-medium">{item.name}</p>
      <img
        className="mt-3 h-20 w-full object-contain"
        src={item.imageUrl || "/default-subcategory.png"}
        alt={item.name}
      />
    </a>
  );
}

export default function SubcategoryView({ subcategories }: { subcategories?: CategoryItem[] }) {
  if (!subcategories || subcategories.length === 0) {
    return <div className="text-sm text-gray-500">No subcategories available.</div>;
  }

  return (
    <div className="space-y-8">
      {subcategories.map((s) => (
        <Node key={s.name} item={s} />
      ))}
    </div>
  );
}
