export type UserProfile = {
  id: string;
  displayName: string | null;
  preferredLocale: string;
};

export type ProfileActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<"displayName" | "preferredLocale", string>>;
};
