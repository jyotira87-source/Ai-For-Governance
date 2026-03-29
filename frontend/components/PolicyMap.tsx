export function PolicyMap() {
  const regions = [
    { label: "Global", size: "w-20", opacity: "opacity-40" },
    { label: "National", size: "w-16", opacity: "opacity-70" },
    { label: "Local", size: "w-12", opacity: "opacity-90" }
  ];

  return (
    <div className="relative flex flex-col gap-4">
      <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 via-black/30 to-accent/10">
        <div className="absolute inset-6 rounded-full border border-white/10" />
        <div className="absolute inset-10 rounded-full border border-white/15" />
        <div className="absolute inset-14 rounded-full border border-accent/30" />
        <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_rgba(225,6,0,0.8)]" />

        {regions.map((region, idx) => (
          <div
            key={region.label}
            className={`absolute left-1/2 flex -translate-x-1/2 items-center justify-center ${region.opacity}`}
            style={{ top: 30 + idx * 22 }}
          >
            <div
              className={`h-6 ${region.size} rounded-full border border-white/15 bg-black/40 text-center text-[10px] leading-6 text-white/75`}
            >
              {region.label}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-[11px] text-white/60">
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
          Scope: global → local
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
          Use map to reason about jurisdiction & enforcement layers.
        </span>
      </div>
    </div>
  );
}

