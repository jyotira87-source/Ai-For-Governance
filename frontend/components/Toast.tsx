"use client";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onDismiss: () => void;
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  const styles = {
    success: "bg-green-500/20 border-green-500/30 text-green-400",
    error: "bg-red-500/20 border-red-500/30 text-red-400",
    info: "bg-blue-500/20 border-blue-500/30 text-blue-400",
    warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠"
  };

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm rounded-lg border p-4 backdrop-blur-md transition-all duration-300 ${styles[type]} z-50`}>
      <div className="flex items-start gap-3">
        <span className="text-xl font-bold">{icons[type]}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-white/50 hover:text-white/80 transition ml-2"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
