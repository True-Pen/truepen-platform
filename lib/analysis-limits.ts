export const FREE_MONTHLY_ANALYSIS_LIMIT = 3;

export const FREE_LIMIT_MESSAGE =
  "You have reached your free monthly limit of 3 analyses. Upgrade to Pro for unlimited analyses.";

export function getCurrentMonthStartIso() {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  return monthStart.toISOString();
}
