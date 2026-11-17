import { LoadingRegion } from "@/components/feedback/loading-region";
import { Skeleton } from "@/components/ui/skeleton";

export function RecommendationsSkeleton() {
  return (
    <LoadingRegion label="Analisando caminhos possíveis…">
      {[0, 1].map((key) => (
        <div
          key={key}
          className="mb-8 rounded-r-lg border-l-4 border-border bg-card p-6 sm:p-8"
        >
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-7 w-2/3" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <div className="mt-6 grid gap-4 border-t pt-6 md:grid-cols-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      ))}
    </LoadingRegion>
  );
}
