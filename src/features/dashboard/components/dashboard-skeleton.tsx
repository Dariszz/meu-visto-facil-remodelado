import { LoadingRegion } from "@/components/feedback/loading-region";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <LoadingRegion label="Carregando seu painel">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-9 w-56" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((key) => (
          <Card key={key} className="p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-8 w-12" />
          </Card>
        ))}
      </div>
      <Card className="mt-10 p-6">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="mt-5 h-2 w-full" />
        <Skeleton className="mt-3 h-4 w-40" />
      </Card>
    </LoadingRegion>
  );
}
