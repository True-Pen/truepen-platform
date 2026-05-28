export function MetricBar({
  score,
  max,
  accent,
}: {
  score: number;
  max: number;
  accent: string;
}) {
  const pct = (score / max) * 100;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${accent} transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
