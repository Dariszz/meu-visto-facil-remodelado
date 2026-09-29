import { expect, test, vi } from "vitest";
import { parseVerificationCommand } from "./verification-command";
vi.mock("server-only", () => ({}));

test("accepts one source ID only with both development confirmations", () => {
  expect(
    parseVerificationCommand(["--confirm-development", "source-123"], {
      NODE_ENV: "development",
      DB_SEED_CONFIRM: "development",
    }),
  ).toBe("source-123");
});
test.each([
  {
    args: ["--confirm-development", "source-123"],
    env: { NODE_ENV: "production", DB_SEED_CONFIRM: "development" },
  },
  { args: ["--confirm-development", "source-123"], env: {} },
  { args: ["source-123"], env: { DB_SEED_CONFIRM: "development" } },
  {
    args: ["--confirm-production", "source-123"],
    env: { DB_SEED_CONFIRM: "development" },
  },
  {
    args: ["--confirm-development", "source-123", "extra"],
    env: { DB_SEED_CONFIRM: "development" },
  },
])(
  "rejects unconfirmed, production and extra-argument invocation %#",
  ({ args, env }) => {
    expect(() => parseVerificationCommand(args, env)).toThrow(
      "SOURCE_VERIFICATION_TARGET_REJECTED",
    );
  },
);
test.each(["https://enterprise.gov.ie/", "../source", "", "x".repeat(129)])(
  "rejects arbitrary URL or invalid ID %s",
  (id) => {
    expect(() =>
      parseVerificationCommand(["--confirm-development", id], {
        DB_SEED_CONFIRM: "development",
      }),
    ).toThrow("SOURCE_ID_INVALID");
  },
);
