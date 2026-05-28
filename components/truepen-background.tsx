export function TruePenBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-indigo-600/15 blur-[100px]" />
      <div className="absolute bottom-0 -left-24 h-64 w-64 rounded-full bg-sky-500/10 blur-[80px]" />
    </div>
  );
}
