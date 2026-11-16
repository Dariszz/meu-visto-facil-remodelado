import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  requireUser: vi.fn(),
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
    signOut: vi.fn(),
    verifyOtp: vi.fn(),
  },
}));
vi.mock("./server-client", () => ({ createAuthClient: mocks.create }));
vi.mock("./require-user", () => ({ requireUser: mocks.requireUser }));
vi.mock("./environment", () => ({
  readAuthEnvironment: () => ({ APP_ORIGIN: "https://example.test" }),
}));
import {
  signIn,
  signUp,
  requestPasswordReset,
  updatePassword,
  signOut,
  confirmEmail,
} from "./operations";

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.create.mockResolvedValue({ auth: mocks.auth });
  Object.values(mocks.auth).forEach((fn) =>
    fn.mockResolvedValue({ error: null }),
  );
});
afterEach(() => vi.restoreAllMocks());
describe("auth operations", () => {
  it("logs fixed failure events without provider details or personal data", async () => {
    const error = {
      code: "email=user@example.test",
      message: "password secret-token",
      status: "private value",
    };
    mocks.auth.signUp.mockResolvedValue({ error });
    mocks.auth.resetPasswordForEmail.mockResolvedValue({ error });
    await signUp("user@example.test", "password");
    await requestPasswordReset("user@example.test");
    expect(vi.mocked(console.error).mock.calls).toEqual([
      [
        JSON.stringify({
          event: "auth_email_operation_failed",
          operation: "sign_up",
        }),
      ],
      [
        JSON.stringify({
          event: "auth_email_operation_failed",
          operation: "request_password_reset",
        }),
      ],
    ]);
  });
  it("logs configuration or network exceptions safely and does not log success", async () => {
    await signUp("user@example.test", "password");
    await requestPasswordReset("user@example.test");
    expect(console.error).not.toHaveBeenCalled();
    mocks.create.mockRejectedValue(new Error("secret-token user@example.test"));
    expect(await requestPasswordReset("user@example.test")).toEqual({
      error: true,
    });
    expect(console.error).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify({
        event: "auth_email_operation_failed",
        operation: "request_password_reset",
      }),
    );
  });
  it("authenticates credentials and exposes only a stable error flag", async () => {
    mocks.auth.signInWithPassword.mockResolvedValue({
      error: { message: "private diagnostic" },
    });
    expect(await signIn("a@example.test", "password")).toEqual({ error: true });
    expect(mocks.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "a@example.test",
      password: "password",
    });
  });
  it("keeps registration and recovery neutral and uses configured origin", async () => {
    mocks.auth.signUp.mockResolvedValue({
      error: { code: "user_already_exists" },
    });
    mocks.auth.resetPasswordForEmail.mockResolvedValue({
      error: { code: "unknown_email" },
    });
    expect(await signUp("a@example.test", "password")).toEqual({
      error: false,
    });
    expect(await requestPasswordReset("a@example.test")).toEqual({
      error: false,
    });
    expect(mocks.auth.signUp).toHaveBeenCalledWith({
      email: "a@example.test",
      password: "password",
      options: { emailRedirectTo: "https://example.test/auth/confirm" },
    });
    expect(mocks.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      "a@example.test",
      { redirectTo: "https://example.test/auth/confirm" },
    );
  });
  it("does not update password without verified identity", async () => {
    mocks.requireUser.mockRejectedValue(new Error("AUTH_REQUIRED"));
    expect(await updatePassword("new password")).toEqual({ error: true });
    expect(mocks.auth.updateUser).not.toHaveBeenCalled();
  });
  it("updates password after authentication and signs out only current session", async () => {
    mocks.requireUser.mockResolvedValue({ id: "user" });
    expect(await updatePassword("new password")).toEqual({ error: false });
    expect(mocks.auth.updateUser).toHaveBeenCalledWith({
      password: "new password",
    });
    expect(await signOut()).toEqual({ error: false });
    expect(mocks.auth.signOut).toHaveBeenCalledWith({ scope: "local" });
  });
  it("verifies the explicit token type and masks failures", async () => {
    expect(await confirmEmail("hash", "recovery")).toEqual({ error: false });
    expect(mocks.auth.verifyOtp).toHaveBeenCalledWith({
      token_hash: "hash",
      type: "recovery",
    });
    mocks.auth.verifyOtp.mockRejectedValue(new Error("secret"));
    expect(await confirmEmail("hash", "signup")).toEqual({ error: true });
  });
});
