import { APP_CONFIG } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-primary">{APP_CONFIG.name}</span>. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

