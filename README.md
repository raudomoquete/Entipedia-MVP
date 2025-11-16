# Entipedia MVP

Entipedia es un MVP para gestionar **proyectos**, **clientes** y **documentación (archivos)** de forma centralizada.

Este monorepo contiene:
- `backend/`: API REST en Node.js + TypeScript (Express, Drizzle ORM, PostgreSQL).
- `ui/`: Frontend en Next.js + React + TypeScript.

---

## Requisitos

- **Node.js**: v18 o superior (idealmente la última LTS).
- **npm**: versión incluida con Node 18+.
- **PostgreSQL**: 14+ (local o en contenedor).
- **Opcional**: Docker/Docker Compose si quieres orquestar la base de datos fácilmente.

---

## Configuración de entorno

### Backend (`backend/.env`)

Parte de `backend/.env.example` y crea un fichero `.env` en la carpeta `backend`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=entipedia
DB_USER=entipedia_user
DB_PASSWORD=entipedia_password

# CORS: debe apuntar al puerto donde corre el frontend
CORS_ORIGIN=http://localhost:3001

# Rate limiting y logging
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

Ajusta los valores de conexión a PostgreSQL según tu entorno.

### Frontend (`ui`)

Por ahora el frontend no requiere variables de entorno adicionales para el entorno local; se asume que la API vive en `http://localhost:3000`.  
Si en el futuro necesitas configurar la URL de la API, podrás hacerlo vía variables de entorno de Next.js (`NEXT_PUBLIC_...`).

---

## Instalación de dependencias

Desde la raíz del repo:

```bash
cd backend
npm install

cd ../ui
npm install
```

---

## Ejecución en local

### 1. Levantar la base de datos

Asegúrate de tener PostgreSQL corriendo y un esquema creado que coincida con las variables de entorno (`DB_NAME`, `DB_USER`, etc.).  
Opcionalmente, puedes usar Docker (ejemplo orientativo):

```bash
docker run --name entipedia-db \
  -e POSTGRES_DB=entipedia \
  -e POSTGRES_USER=entipedia_user \
  -e POSTGRES_PASSWORD=entipedia_password \
  -p 5432:5432 \
  -d postgres:14
```

### 2. Aplicar migraciones

En `backend/`:

```bash
cd backend
npm run db:migrate
```

### 3. Levantar el backend

En `backend/`:

```bash
npm run dev
```

Esto levantará la API en:
- `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

### 4. Levantar el frontend

En otra terminal, en `ui/`:

```bash
cd ui
npm run dev
```

El frontend estará disponible en:
- `http://localhost:3001`

---

## Scripts de pruebas

### Backend

Desde `backend/`:

- Tests unitarios/integración:

```bash
npm test
```

### Frontend

Desde `ui/`:

- Tests unitarios (Jest + Testing Library):

```bash
npm test
```

- Tests E2E (Playwright):

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# UI de Playwright
npm run test:e2e:ui
```

> Nota: Para los tests E2E, Playwright levanta el servidor de Next en `http://localhost:3001` y mockea las APIs del backend, por lo que no es necesario tener la API real corriendo para esta suite.

---

## Resumen rápido de uso

1. Configura `backend/.env` a partir de `.env.example`.
2. Instala dependencias en `backend/` y `ui/`.
3. Levanta PostgreSQL y ejecuta `npm run db:migrate` en `backend/`.
4. Arranca `npm run dev` en `backend/` y `ui/`.
5. Abre `http://localhost:3001` para usar la app y `http://localhost:3000/api-docs` para la documentación de la API.
