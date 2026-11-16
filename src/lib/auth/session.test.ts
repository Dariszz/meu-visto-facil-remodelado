import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const { getUser, create } = vi.hoisted(() => ({
  getUser: vi.fn(),
  create: vi.fn(),
}));
vi.mock("./server-client", () => ({ createAuthClient: create }));
import { getCurrentUser } from "./get-current-user";
import { requireUser, AuthenticationError } from "./require-user";

beforeEach(() => {
  vi.resetAllMocks();
  create.mockResolvedValue({ auth: { getUser } });
});
describe("verified identity", () => {
  it("returns only the verified user identifier and email", async () => {
    getUser.mockResolvedValue({
      data: {
        user: {
          id: "c5182d59-04ac-4a2b-99ed-17b28b4a494a",
          email: "user@example.test",
          user_metadata: { role: "admin" },
        },
      },
      error: null,
    });
    expect(await requireUser()).toEqual({
      id: "c5182d59-04ac-4a2b-99ed-17b28b4a494a",
      email: "user@example.test",
    });
    expect(getUser).toHaveBeenCalledOnce();
  });
  it.each([
    { data: { user: null }, error: null },
    { data: { user: { id: "forged" } }, error: null },
    {
      data: { user: { id: "c5182d59-04ac-4a2b-99ed-17b28b4a494a" } },
      error: { message: "expired" },
    },
  ])(
    "fails closed for absent, malformed or rejected identities",
    async (result) => {
      getUser.mockResolvedValue(result);
      expect(await getCurrentUser()).toBeNull();
      await expect(requireUser()).rejects.toBeInstanceOf(AuthenticationError);
      await expect(requireUser()).rejects.toMatchObject({
        code: "AUTH_REQUIRED",
      });
    },
  );
  it("fails closed on configuration and provider exceptions", async () => {
    create.mockRejectedValue(new Error("secret details"));
    expect(await getCurrentUser()).toBeNull();
  });
});
