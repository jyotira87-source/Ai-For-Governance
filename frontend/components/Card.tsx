import { ReactNode } from "react";

export function Card({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-5 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-24 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-24 bottom-0 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />
      </div>
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-[0.18em] text-white/80 uppercase">
            {title}
          </h3>
          <div className="h-px w-10 bg-gradient-to-r from-white/40 to-transparent" />
        </div>
        <div className="text-[15px] leading-relaxed text-white/85">{children}</div>
      </div>
    </div>
  );
}

