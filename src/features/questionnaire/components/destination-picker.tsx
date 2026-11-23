import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DestinationQuestionnaireStatus } from "../application/questionnaire-service";

const statusLabel: Record<DestinationQuestionnaireStatus["status"], string> = {
  COMPLETE: "Respondido",
  STARTED: "Em andamento",
  NOT_STARTED: "Não iniciado",
};

// Lista de destinos com a situação do questionário de cada um. Cada destino
// tem perguntas próprias, porque as regras e os vistos mudam de país a país.
export function DestinationPicker({
  destinations,
}: {
  destinations: readonly DestinationQuestionnaireStatus[];
}) {
  return (
    <ul className="divide-y border-y">
      {destinations.map((destination) => (
        <li
          key={destination.slug}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4"
        >
          <div>
            <h2 className="font-semibold">{destination.name}</h2>
            <p
              className={
                destination.status === "COMPLETE"
                  ? "text-sm text-success"
                  : "text-sm text-muted-foreground"
              }
            >
              {statusLabel[destination.status]}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
            {destination.status === "COMPLETE" && (
              <Link
                href={`/recommendations/${destination.slug}`}
                className="inline-flex min-h-11 items-center gap-1.5 text-primary underline underline-offset-4"
              >
                Ver recomendações{" "}
                <span className="sr-only">para {destination.name}</span>
              </Link>
            )}
            <Link
              href={`/questionnaire/${destination.slug}`}
              className={
                destination.status === "COMPLETE"
                  ? "inline-flex min-h-11 items-center text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  : "inline-flex min-h-11 items-center gap-1.5 text-primary underline underline-offset-4"
              }
            >
              {destination.status === "COMPLETE"
                ? "Revisar respostas"
                : destination.status === "STARTED"
                  ? "Continuar"
                  : "Responder"}{" "}
              <span className="sr-only">sobre {destination.name}</span>
              {destination.status !== "COMPLETE" && (
                <ArrowRight aria-hidden="true" className="size-4" />
              )}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
