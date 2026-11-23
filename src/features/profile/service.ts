import "server-only";
import { cache } from "react";
import { requireUser } from "@/lib/auth/require-user";
import {
  createUserProfileIfAbsent,
  findUserProfileByAuthUserId,
  updateUserProfileByAuthUserId,
} from "@/lib/db/repositories/user-profile-repository";
import { profileSchema } from "./validation";
import type { UserProfile } from "./types";

export class ProfileUnavailableError extends Error {
  readonly code = "PROFILE_UNAVAILABLE";
  constructor() {
    super("PROFILE_UNAVAILABLE");
    this.name = "ProfileUnavailableError";
  }
}

async function profileOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch {
    console.error(
      JSON.stringify({
        event: "profile_operation_failed",
        code: "PROFILE_UNAVAILABLE",
      }),
    );
    throw new ProfileUnavailableError();
  }
}

// Memorizado por requisição pelo mesmo motivo de getCurrentUser.
export const getCurrentUserProfile = cache(
  async (): Promise<UserProfile | null> => {
    const user = await requireUser();
    return profileOperation(() => findUserProfileByAuthUserId(user.id));
  },
);

export async function createCurrentUserProfile(
  input: unknown,
): Promise<UserProfile> {
  const user = await requireUser();
  const values = profileSchema.parse(input);
  return profileOperation(() =>
    createUserProfileIfAbsent({ ...values, authUserId: user.id }),
  );
}

export async function updateCurrentUserProfile(
  input: unknown,
): Promise<UserProfile | null> {
  const user = await requireUser();
  const values = profileSchema.parse(input);
  return profileOperation(() =>
    updateUserProfileByAuthUserId({ ...values, authUserId: user.id }),
  );
}
