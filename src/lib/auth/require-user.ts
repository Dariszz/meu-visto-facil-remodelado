import "server-only";
import { getCurrentUser } from "./get-current-user";

export class AuthenticationError extends Error {
  readonly code = "AUTH_REQUIRED";
  constructor() {
    super("AUTH_REQUIRED");
    this.name = "AuthenticationError";
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new AuthenticationError();
  return user;
}
