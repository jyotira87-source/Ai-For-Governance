"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  requiresAuth?: boolean;
}

const navigation: NavItem[] = [
  { name: "Home", href: "/", icon: "🏠" },
  { name: "Analyze Policy", href: "/", icon: "📊" },
  { name: "Sentiment Analysis", href: "/sentiment", icon: "📈" },
  { name: "Dashboard", href: "/dashboard", icon: "📋", requiresAuth: true },
  { name: "History", href: "/history", icon: "📚", requiresAuth: true }
];

export function NavigationHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/auth");
    setIsMobileMenuOpen(false);
  };

  const filteredNavigation = navigation.filter(item =>
    !item.requiresAuth || (item.requiresAuth && token)
  );

  const currentPage = navigation.find(item => item.href === pathname)?.name || "PolisAI";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/82 backdrop-blur-md border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-red-500 transition-transform group-hover:scale-110">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                  PolisAI
                </span>
              </Link>

              {/* Breadcrumb */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-white/60">
                <span>Home</span>
                <span>/</span>
                <span className="text-accent">{currentPage}</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {token ? (
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {user?.full_name || user?.username}
                    </div>
                    <div className="text-xs text-white/50">
                      {user?.email}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    aria-label="Logout from account"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link
                    href="/auth"
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth"
                    className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 text-white font-medium text-sm transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg p-2 text-white/70 transition hover:bg-white/5 hover:text-white md:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                    pathname === item.href
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              {token ? (
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="px-4 py-2">
                    <div className="text-sm font-medium text-white">
                      {user?.full_name || user?.username}
                    </div>
                    <div className="text-xs text-white/50">
                      {user?.email}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition font-medium text-sm text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                  <Link
                    href="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 text-white font-medium text-sm text-center transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}