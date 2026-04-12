"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={`transform-gpu transition-all duration-500 ease-out ${isLoading ? 'translate-y-3 opacity-0 blur-[1px]' : 'translate-y-0 opacity-100 blur-0'}`}>
      {children}
    </div>
  );
}