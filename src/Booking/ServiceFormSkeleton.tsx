import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceFormSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* City and District */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-5 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Description */}
      <div>
        <Skeleton className="h-5 w-28 mb-2" />
        <Skeleton className="h-32 w-full" />
      </div>

      {/* Address */}
      <div>
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Main Image */}
      <div>
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Gallery Images */}
      <div>
        <Skeleton className="h-5 w-36 mb-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-48 mt-1" />
      </div>

      {/* Category and Subcategory */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-36 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Estimated Time */}
      <div>
        <Skeleton className="h-5 w-28 mb-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-56 mt-1" />
      </div>

      {/* Price */}
      <div>
        <Skeleton className="h-5 w-16 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Price Range */}
      <div>
        <Skeleton className="h-5 w-48 mb-2" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-4 w-72 mt-1" />
      </div>

      {/* Website URL */}
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Email */}
      <div>
        <Skeleton className="h-5 w-20 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Social Media URLs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-28 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
