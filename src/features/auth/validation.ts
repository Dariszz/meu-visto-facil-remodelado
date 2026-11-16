import { z } from "zod";

const email = z.email("Informe um e-mail válido.").max(254).trim();
const password = z
  .string()
  .min(8, "Use pelo menos 8 caracteres.")
  .max(128, "Use até 128 caracteres.");
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Informe sua senha.").max(128),
});
export const emailSchema = z.object({ email });
export const passwordSchema = z
  .object({ password, confirmPassword: z.string() })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas precisam ser iguais.",
  });
export const registerSchema = z
  .object({ email, password, confirmPassword: z.string() })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas precisam ser iguais.",
  });
export const confirmationSchema = z.object({
  token_hash: z.string().min(1).max(2048),
  type: z.enum(["signup", "recovery"]),
});
