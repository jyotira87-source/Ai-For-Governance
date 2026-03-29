export function PolicyFlow() {
  const steps = [
    { label: "Draft", accent: false },
    { label: "Review", accent: false },
    { label: "Impact & Rights Analysis", accent: true },
    { label: "Public Consultation", accent: false },
    { label: "Implementation", accent: false },
    { label: "Monitoring", accent: true }
  ];

  return (
    <div className="relative flex flex-col gap-3">
      <div className="absolute left-4 top-5 bottom-5 w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent md:left-1/2 md:top-1/2 md:h-px md:w-3/4 md:-translate-x-1/2 md:bg-gradient-to-r" />
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, idx) => (
          <div key={step.label} className="relative flex items-center gap-3 md:flex-col">
            <div className="relative z-10 flex h-8 w-8 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-black/70" />
              <div
                className={`relative flex h-6 w-6 items-center justify-center rounded-full border ${
                  step.accent
                    ? "border-accent/80 bg-accent/20 shadow-[0_0_24px_rgba(225,6,0,0.5)]"
                    : "border-white/25 bg-white/5"
                }`}
              >
                <span className="text-xs text-white/80">{idx + 1}</span>
              </div>
            </div>
            <div className="z-10">
              <div className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
                {step.label}
              </div>
              {step.accent ? (
                <div className="mt-1 text-xs text-white/65">
                  Deep AI analysis focus point for rights & risk.
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

