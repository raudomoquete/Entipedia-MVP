# Entipedia UI

Frontend de Entipedia construido con Next.js 16, React 19, TypeScript y Tailwind CSS.

## Estructura del Proyecto

```
UI/
├── app/                    # Next.js App Router (pages, layouts, routes)
├── components/             # Componentes reutilizables
│   ├── ui/                # Componentes base del sistema de diseño
│   └── layout/            # Componentes de layout
├── features/              # Features organizados por dominio
├── hooks/                 # Custom React hooks
├── lib/                   # Utilidades y configuración
│   ├── api-client.ts     # Cliente HTTP con manejo de ProblemDetails
│   ├── cn.ts             # Utilidad para clases CSS
│   └── constants.ts      # Constantes de la aplicación
├── services/              # Servicios para llamadas a API
├── types/                 # Tipos TypeScript compartidos
└── utils/                 # Funciones utilitarias
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint
- `npm run lint:fix` - Corrige errores de ESLint automáticamente
- `npm run format` - Formatea el código con Prettier
- `npm run format:check` - Verifica el formato del código
- `npm run type-check` - Verifica tipos TypeScript
- `npm run test` - Ejecuta tests
- `npm run test:watch` - Ejecuta tests en modo watch
- `npm run test:coverage` - Genera reporte de cobertura

## Tecnologías Principales

- **Next.js 16** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utility-first
- **TanStack Query** - Manejo de estado del servidor y caché
- **Axios** - Cliente HTTP
- **Zod** - Validación de esquemas
- **Jest + React Testing Library** - Testing

## Configuración

1. Copia `.env.example` a `.env.local`
2. Configura `NEXT_PUBLIC_API_URL` con la URL de tu backend

## Características

- ✅ Arquitectura escalable y mantenible
- ✅ Manejo de errores con ProblemDetails del backend
- ✅ TypeScript estricto
- ✅ Componentes reutilizables
- ✅ Custom hooks para API
- ✅ Sistema de diseño base
- ✅ Testing configurado
- ✅ ESLint + Prettier configurados
