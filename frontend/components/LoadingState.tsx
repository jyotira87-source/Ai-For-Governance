"use client";

import { Spinner } from "./Spinner";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = "Loading...", fullScreen = false }: LoadingStateProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <div className="text-center space-y-4">
        <Spinner size="lg" />
        <p className="text-white/70 text-sm animate-pulse">{message}</p>
      </div>
    </div>
  );
}