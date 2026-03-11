import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border-border/50 shadow-sm">
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Skeleton className="h-3 w-8 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>

                <div>
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>

                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-28" />
                </div>

                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>

                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>

                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Skeleton className="flex-1 h-9" />
                <Skeleton className="flex-1 h-9" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
