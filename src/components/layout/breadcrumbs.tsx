import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
}: {
  items: readonly { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Caminho de navegação" className="py-6 text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-md text-primary hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-muted-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
