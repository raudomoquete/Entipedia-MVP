import express, { Express } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from '../../../shared/constants/env';
import { logger } from '../../../infrastructure/logger/logger';
import { errorHandler } from '../middlewares/error-handler';
import { swaggerSetup } from './swagger';
import { ProjectController } from '../controllers/project-controller';
import { ProjectService } from '../../../application/services/project-service';
import { ProjectRepository } from '../../../infrastructure/repositories/project-repository';
import { ClientController } from '../controllers/client-controller';
import { ClientService } from '../../../application/services/client-service';
import { ClientRepository } from '../../../infrastructure/repositories/client-repository';
import { FileController } from '../controllers/file-controller';
import { FileService } from '../../../application/services/file-service';
import { FileRepository } from '../../../infrastructure/repositories/file-repository';
import { LocalFileStorageService } from '../../../infrastructure/storage/local-file-storage-service';

export function createApp(): Express {
  const app = express();

  // CORS configuration - DEBE estar ANTES de helmet
  const allowedOrigins = env.NODE_ENV === 'development' 
    ? ['http://localhost:3001', 'http://localhost:5173', 'http://localhost:3000']
    : [env.CORS_ORIGIN];

  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean | string) => void) => {
      // Si no hay origen (ej: misma-origen, solicitudes desde el mismo servidor), permitir
      if (!origin) {
        callback(null, true);
        return;
      }
      
      // Verificar si el origen está en la lista permitida
      if (allowedOrigins.includes(origin)) {
        callback(null, origin);
        return;
      }
      
      // Rechazar origen no permitido
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  logger.info({ allowedOrigins, corsOrigin: env.CORS_ORIGIN, nodeEnv: env.NODE_ENV }, 'CORS configuration loaded');
  app.use(cors(corsOptions));

  // Security middleware - Configurar helmet para no interferir con CORS
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    })
  );

  // Compression
  app.use(compression());

  // Request logging
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => {
          logger.info(message.trim());
        },
      },
    })
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static files for uploads (serves files from /uploads)
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: {
      type: 'TOO_MANY_REQUESTS',
      title: 'Too Many Requests',
      status: 429,
      detail: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  const projectRepository = new ProjectRepository();
  const projectService = new ProjectService(projectRepository);
  const projectController = new ProjectController(projectService);

  const clientRepository = new ClientRepository();
  const clientService = new ClientService(clientRepository);
  const clientController = new ClientController(clientService);

  const fileRepository = new FileRepository();
  const storageService = new LocalFileStorageService();
  const fileService = new FileService(fileRepository, storageService);
  const fileController = new FileController(fileService);

  app.use('/api/v1', projectController.router);
  app.use('/api/v1', clientController.router);
  app.use('/api/v1', fileController.router);

  // Swagger documentation
  swaggerSetup(app);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

