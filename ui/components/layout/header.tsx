import Link from 'next/link';
import Image from 'next/image';
import { APP_CONFIG, ROUTES } from '@/lib/constants';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={ROUTES.home} className="flex items-center gap-2">
            {/* TODO: Reemplazar por logo oficial de Entipedia cuando esté disponible */}
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-lg font-bold">E</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-semibold tracking-tight">
                {APP_CONFIG.name}
              </span>
              <span className="text-xs text-muted-foreground">MVP</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

