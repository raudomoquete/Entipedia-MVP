import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../../../shared/constants/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Entipedia API',
      version: '1.0.0',
      description: 'API documentation for Entipedia MVP',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        ProblemDetails: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'A URI reference that identifies the problem type',
            },
            title: {
              type: 'string',
              description: 'A short, human-readable summary of the problem type',
            },
            status: {
              type: 'integer',
              description: 'The HTTP status code',
            },
            detail: {
              type: 'string',
              description: 'A human-readable explanation specific to this occurrence of the problem',
            },
            instance: {
              type: 'string',
              description: 'A URI reference that identifies the specific occurrence of the problem',
            },
          },
          required: ['type', 'title', 'status', 'detail'],
        },
      },
      responses: {
        ProblemDetails: {
          description: 'Problem Details response (RFC 7807)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProblemDetails',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/interfaces/rest/**/*.ts', './src/interfaces/rest/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerSetup(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

