"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface QuickAction {
  icon: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

export function QuickActions({ actions, title = "Quick Actions" }: QuickActionsProps) {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">Navigation</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/45 md:block">
          1 click away
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => (
          <div
            key={index}
            className="group cursor-pointer rounded-[1.4rem] border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            onClick={() => action.external ? window.open(action.href, '_blank') : router.push(action.href)}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-xl shadow-inner transition group-hover:border-accent/30 group-hover:bg-accent/10">
                {action.icon}
              </span>
              <span className="text-base font-semibold text-white transition group-hover:text-accent">
                {action.title}
              </span>
            </div>
            <p className="text-sm leading-6 text-white/60">{action.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Predefined action sets
export const mainPageActions: QuickAction[] = [
  {
    icon: "📊",
    title: "Sentiment Analysis",
    description: "Analyze public sentiment and social media reactions",
    href: "/sentiment"
  },
  {
    icon: "📋",
    title: "Dashboard",
    description: "View your analysis history and account overview",
    href: "/dashboard"
  },
  {
    icon: "📚",
    title: "History",
    description: "Review past policy analyses and insights",
    href: "/history"
  }
];

export const dashboardActions: QuickAction[] = [
  {
    icon: "📝",
    title: "New Analysis",
    description: "Analyze a new policy proposal",
    href: "/"
  },
  {
    icon: "📊",
    title: "Sentiment Analysis",
    description: "Check public sentiment on policies",
    href: "/sentiment"
  },
  {
    icon: "📚",
    title: "View History",
    description: "Review your past analyses",
    href: "/history"
  }
];

export const sentimentActions: QuickAction[] = [
  {
    icon: "📋",
    title: "Policy Analysis",
    description: "Get detailed governance insights",
    href: "/"
  },
  {
    icon: "📊",
    title: "Dashboard",
    description: "View your analysis history",
    href: "/dashboard"
  },
  {
    icon: "🔄",
    title: "New Analysis",
    description: "Start fresh with a new policy",
    href: "/sentiment"
  }
];

export const historyActions: QuickAction[] = [
  {
    icon: "📝",
    title: "New Analysis",
    description: "Analyze a new policy",
    href: "/"
  },
  {
    icon: "📊",
    title: "Sentiment Analysis",
    description: "Check public sentiment",
    href: "/sentiment"
  },
  {
    icon: "📋",
    title: "Dashboard",
    description: "View your overview",
    href: "/dashboard"
  }
];