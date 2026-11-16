import { z } from "zod";

export const profileSchema = z.strictObject({
  displayName: z
    .string()
    .trim()
    .max(100, "Use até 100 caracteres.")
    .refine(
      (value) => !/[\u0000-\u001f\u007f]/.test(value),
      "Informe um nome sem caracteres de controle.",
    )
    .transform((value) => value || null),
  preferredLocale: z.literal("pt-BR", {
    error: "Selecione Português (Brasil).",
  }),
});
