'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { FolderKanban, Users, Files } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

const navItems = [
  {
    label: 'Proyectos',
    href: ROUTES.projects,
    icon: FolderKanban,
  },
  {
    label: 'Clientes',
    href: ROUTES.clients,
    icon: Users,
  },
  {
    label: 'Archivos',
    href: ROUTES.files,
    icon: Files,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-sm font-semibold text-muted-foreground">
          Navegación
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-[var(--primary-hover)]/20 hover:text-primary',
                isActive
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


