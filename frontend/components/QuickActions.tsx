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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <div
            key={index}
            className="group p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 cursor-pointer"
            onClick={() => action.external ? window.open(action.href, '_blank') : router.push(action.href)}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{action.icon}</span>
              <span className="text-white font-semibold group-hover:text-accent transition">
                {action.title}
              </span>
            </div>
            <p className="text-white/60 text-sm">{action.description}</p>
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