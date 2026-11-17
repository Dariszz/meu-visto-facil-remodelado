import Link from "next/link";
import { Compass } from "lucide-react";
export function Brand() {
  return (
    <Link
      href="/"
      aria-label="Meu Visto Fácil, página inicial"
      className="inline-flex min-h-11 items-center gap-3 rounded-md"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Compass aria-hidden="true" className="size-6" strokeWidth={1.6} />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        meu visto<span className="text-primary"> fácil.</span>
      </span>
    </Link>
  );
}
