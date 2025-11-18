import { cn } from '@/lib/cn';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Logo oficial de Entipedia
 * Reproduce el diseño del logo: elemento gráfico (dos rectángulos superpuestos)
 * + texto "ENTI" en amarillo
 */
export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-sm' },
    md: { icon: 32, text: 'text-lg' },
    lg: { icon: 48, text: 'text-2xl' },
  };

  const { icon: iconSize, text: textSize } = sizes[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Elemento gráfico: dos rectángulos superpuestos (logo oficial de Entipedia) */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        {/* Forma gris (sombra/fondo detrás) - se ve ligeramente a la derecha y arriba */}
        <rect
          x="7"
          y="5"
          width="20"
          height="20"
          rx="3"
          fill="#E5E5E5"
          stroke="none"
        />
        {/* Forma amarilla (frente) - rectángulo con esquina superior derecha redondeada */}
        <rect
          x="4"
          y="6"
          width="18"
          height="18"
          rx="3"
          fill="#FFFF00"
          stroke="none"
        />
        {/* Borde negro izquierdo (sugiere profundidad/plegado) */}
        <line
          x1="4"
          y1="6"
          x2="4"
          y2="24"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Borde negro inferior (sugiere profundidad/plegado) */}
        <line
          x1="4"
          y1="24"
          x2="22"
          y2="24"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Texto "ENTI" */}
      {showText && (
        <span
          className={cn(
            'font-bold uppercase tracking-tight text-[var(--entipedia-yellow)]',
            textSize
          )}
          style={{ color: '#FFFF00' }}
        >
          ENTI
        </span>
      )}
    </div>
  );
}

