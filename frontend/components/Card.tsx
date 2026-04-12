import { ReactNode } from "react";

export function Card({
  title,
  children,
  className = ""
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const hasTitle = !!title;

  return (
    <div className={`glass relative overflow-hidden rounded-[1.75rem] border border-white/10 p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_32px_90px_rgba(0,0,0,0.55)] ${className}`}>
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-20 top-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-36 w-36 rounded-full bg-accent/12 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      <div className="relative">
        {hasTitle && (
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-[11px] font-semibold tracking-[0.26em] text-white/78 uppercase">
              {title}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/35 via-white/10 to-transparent" />
          </div>
        )}
        <div className="text-[15px] leading-relaxed text-white/88">{children}</div>
      </div>
    </div>
  );
}

