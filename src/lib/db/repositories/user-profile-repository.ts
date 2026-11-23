import "server-only";
import type { Prisma } from "../generated/client";
import { getProfileDatabaseClient } from "../profile-client";

const profileSelect = {
  id: true,
  displayName: true,
  preferredLocale: true,
} satisfies Prisma.UserProfileSelect;

export type UserProfile = Prisma.UserProfileGetPayload<{
  select: typeof profileSelect;
}>;

export async function findUserProfileByAuthUserId(
  authUserId: string,
  db?: Prisma.TransactionClient,
): Promise<UserProfile | null> {
  return (db ?? getProfileDatabaseClient()).userProfile.findUnique({
    where: { authUserId },
    select: profileSelect,
  });
}

export async function createUserProfileIfAbsent(
  input: {
    authUserId: string;
    displayName: string | null;
    preferredLocale: string;
  },
  db?: Prisma.TransactionClient,
): Promise<UserProfile> {
  const client = db ?? getProfileDatabaseClient();
  // ON CONFLICT DO NOTHING preserves existing values and requires no UPDATE grant.
  await client.userProfile.createMany({
    data: {
      authUserId: input.authUserId,
      displayName: input.displayName,
      preferredLocale: input.preferredLocale,
    },
    skipDuplicates: true,
  });
  return client.userProfile.findUniqueOrThrow({
    where: { authUserId: input.authUserId },
    select: profileSelect,
  });
}

// Apaga o perfil e, por cascade, respostas, processos, snapshots e checklists.
export async function deleteUserProfileByAuthUserId(
  authUserId: string,
  db?: Prisma.TransactionClient,
): Promise<number> {
  const { count } = await (
    db ?? getProfileDatabaseClient()
  ).userProfile.deleteMany({ where: { authUserId } });
  return count;
}

// Só os campos editáveis pela pessoa; dono identificado pela sessão.
export async function updateUserProfileByAuthUserId(
  input: {
    authUserId: string;
    displayName: string | null;
    preferredLocale: string;
  },
  db?: Prisma.TransactionClient,
): Promise<UserProfile | null> {
  const client = db ?? getProfileDatabaseClient();
  const { count } = await client.userProfile.updateMany({
    where: { authUserId: input.authUserId },
    data: {
      displayName: input.displayName,
      preferredLocale: input.preferredLocale,
    },
  });
  if (count !== 1) return null;
  return client.userProfile.findUnique({
    where: { authUserId: input.authUserId },
    select: profileSelect,
  });
}
