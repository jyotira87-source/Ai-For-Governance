export function Spinner() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative h-5 w-5">
        <div className="absolute inset-0 rounded-full border border-white/20" />
        <div className="absolute inset-0 rounded-full border border-transparent border-t-accent/90 animate-spin" />
      </div>
      <span className="text-sm tracking-wide text-white/70">Analyzing…</span>
    </div>
  );
}

