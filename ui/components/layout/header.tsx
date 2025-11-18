import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Logo } from '@/components/ui/logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={ROUTES.home} className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label="Ir al inicio">
            <Logo size="md" showText={true} />
            <span className="text-xs text-muted-foreground">MVP</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

