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

export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
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

  // Static files for uploads
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

  app.use('/api/v1', projectController.router);
  app.use('/api/v1', clientController.router);

  // Swagger documentation
  swaggerSetup(app);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

