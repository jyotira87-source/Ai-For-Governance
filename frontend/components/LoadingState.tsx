"use client";

import { Spinner } from "./Spinner";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = "Loading...", fullScreen = false }: LoadingStateProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <div className="glass rounded-[1.75rem] border border-white/10 px-6 py-5 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="mx-auto flex w-fit items-center justify-center rounded-2xl bg-black/25 px-4 py-3">
          <Spinner size="lg" />
        </div>
        <p className="mt-4 text-sm text-white/72">{message}</p>
      </div>
    </div>
  );
}