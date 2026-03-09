import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyServiceSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 sm:mt-10 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <CardAction>
              <div className="flex gap-1">
                <Skeleton className="size-8" />
                <Skeleton className="size-8" />
                <Skeleton className="size-8" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
