import { Skeleton } from "@/components/ui/skeleton";

// InfoTab Loading Skeleton
export function InfoTabSkeleton() {
  return (
    <div className="bg-linear-to-br from-gray-50 to-blue-50/30 px-4 md:px-6 py-8 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Username Card Skeleton */}
        <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>

        {/* Email Card Skeleton */}
        <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>

        {/* Full Name Card Skeleton */}
        <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-36" />
          </div>
        </div>

        {/* Account Created Card Skeleton */}
        <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>

        {/* Status Card Skeleton */}
        <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl md:col-span-2">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>

      {/* CTA Skeleton */}
      <Skeleton className="h-32 w-full rounded-3xl" />
    </div>
  );
}

// HistoryTab Loading Skeleton
export function HistoryTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs Skeleton */}
      <div className="flex justify-center mb-6">
        <div className="flex gap-2">
          <Skeleton className="h-12 w-24 rounded-lg" />
          <Skeleton className="h-12 w-24 rounded-lg" />
          <Skeleton className="h-12 w-24 rounded-lg" />
        </div>
      </div>

      {/* History Items Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 bg-white border border-gray-200 rounded-2xl"
          >
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-24 mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ProfileForm Loading Skeleton
export function ProfileFormSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6 bg-linear-to-br from-gray-50 to-blue-50/30 px-4 md:px-6 py-8 rounded-2xl">
      {/* Avatar and Name Skeleton */}
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>

      {/* Name Fields Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Gender and Birth Date Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Phone Number Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-16 md:w-20 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>
      </div>

      {/* Email Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-12 w-32 rounded-xl" />
        <Skeleton className="h-12 w-40 rounded-xl" />
      </div>
    </div>
  );
}

// Simple Spinner Loader (Alternative)
export function SpinnerLoader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}

// Pulsing Dots Loader (Alternative)
export function DotsLoader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
      </div>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}
