export function Spinner({ size }: { size?: "sm" | "md" | "lg" } = {}) {
  const sizeClass = size === "lg" ? "h-8 w-8" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const hideText = size === "sm" || size === "lg";

  return (
    <div className="inline-flex items-center gap-3">
      <div className={`relative ${sizeClass}`}>
        <div className="absolute inset-0 rounded-full border border-white/20" />
        <div className="absolute inset-0 rounded-full border border-transparent border-t-accent/90 animate-spin" />
      </div>
      {!hideText && <span className="text-sm tracking-wide text-white/70">Analyzing…</span>}
    </div>
  );
}

