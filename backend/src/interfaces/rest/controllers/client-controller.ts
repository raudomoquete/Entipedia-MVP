import { Request, Response, NextFunction, Router } from 'express';
import { BaseController } from './base-controller';
import { asyncHandler } from '../middlewares/async-handler';
import { ClientService } from '../../../application/services/client-service';
import {
  createClientSchema,
  updateClientSchema,
  paginationSchema,
} from '../validators/client-validators';

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management
 */
export class ClientController extends BaseController {
  public readonly router: Router;

  constructor(private readonly clientService: ClientService) {
    super();
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    /**
     * @swagger
     * /api/v1/clients:
     *   get:
     *     summary: Get all clients (paginated)
     *     tags: [Clients]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *           default: 10
     *     responses:
     *       200:
     *         description: Paginated list of clients
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.get('/clients', this.getAll);

    /**
     * @swagger
     * /api/v1/clients/{id}:
     *   get:
     *     summary: Get client by ID
     *     tags: [Clients]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Client found
     *       404:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.get('/clients/:id', this.getById);

    /**
     * @swagger
     * /api/v1/clients:
     *   post:
     *     summary: Create a new client
     *     tags: [Clients]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               type:
     *                 type: string
     *                 enum: [PERSON, COMPANY]
     *               email:
     *                 type: string
     *               phone:
     *                 type: string
     *               lifetimeValue:
     *                 type: number
     *                 description: Approximate lifetime value in DOP
     *     responses:
     *       201:
     *         description: Client created
     *       400:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.post('/clients', this.create);

    /**
     * @swagger
     * /api/v1/clients/{id}:
     *   patch:
     *     summary: Update a client (inline edit)
     *     tags: [Clients]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               type:
     *                 type: string
     *                 enum: [PERSON, COMPANY]
     *               email:
     *                 type: string
     *               phone:
     *                 type: string
     *               lifetimeValue:
     *                 type: number
     *     responses:
     *       200:
     *         description: Client updated
     *       400:
     *         $ref: '#/components/responses/ProblemDetails'
     *       404:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.patch('/clients/:id', this.update);

    /**
     * @swagger
     * /api/v1/clients/{id}:
     *   delete:
     *     summary: Delete a client
     *     tags: [Clients]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: Client deleted
     *       404:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.delete('/clients/:id', this.delete);
  }

  public getAll = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const parsed = paginationSchema.safeParse(req.query);
      if (!parsed.success) {
        this.badRequest(res, parsed.error.issues[0]?.message);
        return;
      }

      const { page, pageSize } = parsed.data;
      const result = await this.clientService.getAllClients(page, pageSize);
      this.handleResult(result, req, res, next);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await this.clientService.getClientById(id);
      this.handleResult(result, req, res, next);
    }
  );

  public create = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const parseResult = createClientSchema.safeParse(req.body);
      if (!parseResult.success) {
        this.badRequest(res, parseResult.error.issues[0]?.message);
        return;
      }

      const result = await this.clientService.createClient(parseResult.data);
      if (!result.success) {
        this.handleResult(result, req, res, next);
        return;
      }

      this.created(res, result.value, `/api/v1/clients/${result.value.id}`);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const parseResult = updateClientSchema.safeParse(req.body);
      if (!parseResult.success) {
        this.badRequest(res, parseResult.error.issues[0]?.message);
        return;
      }

      const result = await this.clientService.updateClient(
        id,
        parseResult.data
      );
      this.handleResult(result, req, res, next);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await this.clientService.deleteClient(id);
      if (!result.success) {
        this.handleResult(result, req, res, next);
        return;
      }

      this.noContent(res);
    }
  );
}


