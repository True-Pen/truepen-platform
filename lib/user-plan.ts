import type { User } from "@supabase/supabase-js";

export function isProUser(user: User): boolean {
  const plan =
    (user.user_metadata?.plan as string | undefined) ??
    (user.app_metadata?.plan as string | undefined);
  return plan === "pro";
}
