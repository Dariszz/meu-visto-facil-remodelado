import type { Notice } from "@/components/feedback/action-notice";

// Avisos que podem aparecer via ?aviso=… depois de mudar a situação de um processo.
const processNotices = {
  pausado: {
    tone: "success",
    message:
      "Processo pausado. Seu progresso fica guardado; retome quando quiser.",
  },
  retomado: { tone: "success", message: "Processo em andamento de novo." },
  concluido: {
    tone: "success",
    message: "Processo marcado como concluído. Parabéns por chegar até aqui!",
  },
  erro: {
    tone: "error",
    message:
      "Não foi possível mudar a situação do processo. Tente novamente em instantes.",
  },
} as const satisfies Record<string, Notice>;

const dashboardNotices = {
  arquivado: {
    tone: "success",
    message:
      "Processo arquivado. Ele não aparece mais no painel; seus outros processos continuam iguais.",
  },
} as const satisfies Record<string, Notice>;

export type ProcessNoticeKey = keyof typeof processNotices;

function pick<T extends Record<string, Notice>>(
  notices: T,
  value: unknown,
): Notice | undefined {
  return typeof value === "string" && Object.hasOwn(notices, value)
    ? notices[value]
    : undefined;
}

export const processNotice = (value: unknown) => pick(processNotices, value);
export const dashboardNotice = (value: unknown) =>
  pick(dashboardNotices, value);

export const statusNoticeKey = {
  ACTIVE: "retomado",
  PAUSED: "pausado",
  COMPLETED: "concluido",
} as const satisfies Record<string, ProcessNoticeKey>;
