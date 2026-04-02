"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumb() {
  const pathname = usePathname();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ name: 'Home', href: '/' }];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const name = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
      breadcrumbs.push({ name, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-white/60 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-accent font-medium">{crumb.name}</span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-white transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}