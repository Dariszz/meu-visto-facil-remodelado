import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CatalogSource } from "@/features/visas/catalog-types";
import { formatConsultedDate } from "@/features/visas/catalog-presentation";
import { safeSourceLink } from "./source-link-policy";

const statusLabels: Record<CatalogSource["status"], string> = {
  ACTIVE: "Fonte cadastrada",
  TEMPORARILY_UNAVAILABLE: "Temporariamente indisponível",
  BROKEN: "Link indisponível",
};

function VerificationDate({ value }: { value: string }) {
  return (
    <time dateTime={value}>
      {new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "long",
        timeStyle: "medium",
        timeZone: "UTC",
      }).format(new Date(value))}{" "}
      UTC
    </time>
  );
}

export function OfficialSourceItem({ source }: { source: CatalogSource }) {
  const href =
    source.status === "ACTIVE" && source.url
      ? safeSourceLink(source.url, source.hostname)
      : null;

  return (
    <li id={`source-${source.id}`} className="scroll-mt-6 py-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {href ? (
          <a
            href={href}
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4"
          >
            {source.title}
            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
          </a>
        ) : (
          <p className="font-semibold">{source.title}</p>
        )}
        <Badge variant="outline">{statusLabels[source.status]}</Badge>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {source.authority}
      </p>
      <p className="mt-1 break-all text-sm text-muted-foreground">
        {source.hostname}
      </p>
      {!href && source.status === "ACTIVE" && (
        <p className="mt-2 text-sm text-muted-foreground">Link indisponível</p>
      )}
      <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="font-medium">Consulta editorial</dt>
          <dd className="mt-1 leading-relaxed text-muted-foreground">
            {source.consultedAt ? (
              <time dateTime={source.consultedAt}>
                {formatConsultedDate(source.consultedAt)}
              </time>
            ) : (
              "Não informada"
            )}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Última tentativa de verificação</dt>
          <dd className="mt-1 leading-relaxed text-muted-foreground">
            {source.lastVerifiedAt ? (
              <VerificationDate value={source.lastVerifiedAt} />
            ) : (
              "Não registrada"
            )}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Última verificação bem-sucedida</dt>
          <dd className="mt-1 leading-relaxed text-muted-foreground">
            {source.lastSuccessfulVerificationAt ? (
              <VerificationDate value={source.lastSuccessfulVerificationAt} />
            ) : (
              "Nenhuma registrada"
            )}
          </dd>
        </div>
      </dl>
    </li>
  );
}
