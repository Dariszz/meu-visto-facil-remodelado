import Link from "next/link";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type Notice = { tone: "success" | "error"; message: string };

// Aviso exibido depois de uma ação que recarrega a página (ex.: arquivar).
// O texto vem sempre de uma lista fixa; nada da URL é exibido diretamente.
export function ActionNotice({
  notice,
  dismissHref,
  className,
}: {
  notice: Notice;
  dismissHref: string;
  className?: string;
}) {
  const Icon = notice.tone === "success" ? CircleCheck : CircleAlert;
  return (
    <div
      role={notice.tone === "success" ? "status" : "alert"}
      className={cn(
        "flex items-start gap-3 rounded-md border px-4 py-3 text-sm",
        notice.tone === "success"
          ? "border-success/30 bg-success-subtle text-success"
          : "border-destructive/40 text-destructive",
        className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p className="flex-1 leading-relaxed">{notice.message}</p>
      <Link
        href={dismissHref}
        replace
        scroll={false}
        aria-label="Fechar aviso"
        className="-m-2 inline-flex size-9 shrink-0 items-center justify-center rounded-md hover:bg-background/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <X aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
