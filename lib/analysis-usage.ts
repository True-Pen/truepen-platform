import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import {
  FREE_MONTHLY_ANALYSIS_LIMIT,
  getCurrentMonthStartIso,
} from "@/lib/analysis-limits";
import { isProUser } from "@/lib/user-plan";

export async function getMonthlyUsageCount(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("analysis_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", getCurrentMonthStartIso());

  if (error) throw error;
  return count ?? 0;
}

export async function recordAnalysisUsage(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { error } = await supabase.from("analysis_usage").insert({
    user_id: userId,
  });

  if (error) throw error;
}

export function hasReachedFreeLimit(usageCount: number): boolean {
  return usageCount >= FREE_MONTHLY_ANALYSIS_LIMIT;
}

export async function isAtFreeMonthlyLimit(
  supabase: SupabaseClient,
  user: User,
): Promise<boolean> {
  if (isProUser(user)) return false;
  const usageCount = await getMonthlyUsageCount(supabase, user.id);
  return hasReachedFreeLimit(usageCount);
}
