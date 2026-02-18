import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySkeleton() {
  return (
    <nav className="w-full lg:w-64 lg:h-125 rounded-2xl border p-4 lg:overflow-hidden relative left-1 sm:left-2 lg:left-10 z-50">
      <ul className="space-y-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <li key={index} className="lg:block">
            <div className="w-full rounded-lg px-4 py-3 flex items-center gap-3">
              <Skeleton className="w-5 h-5 rounded-md" />
              <Skeleton className="h-4 flex-1" />
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
