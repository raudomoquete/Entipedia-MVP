import { Request, Response, NextFunction, Router } from 'express';
import { BaseController } from './base-controller';
import { asyncHandler } from '../middlewares/async-handler';
import { ProjectService } from '../../../application/services/project-service';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../validators/project-validators';

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */
export class ProjectController extends BaseController {
  public readonly router: Router;

  constructor(private readonly projectService: ProjectService) {
    super();
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    /**
     * @swagger
     * /api/v1/projects:
     *   get:
     *     summary: Get all projects
     *     tags: [Projects]
     *     responses:
     *       200:
     *         description: List of projects
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.get('/projects', this.getAll);

    /**
     * @swagger
     * /api/v1/projects/{id}:
     *   get:
     *     summary: Get project by ID
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Project found
     *       404:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.get('/projects/:id', this.getById);

    /**
     * @swagger
     * /api/v1/projects:
     *   post:
     *     summary: Create a new project
     *     tags: [Projects]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               status:
     *                 type: string
     *                 enum: [PENDING, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED]
     *               priority:
     *                 type: string
     *                 enum: [LOW, MEDIUM, HIGH, URGENT]
     *     responses:
     *       201:
     *         description: Project created
     *       400:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.post('/projects', this.create);

    /**
     * @swagger
     * /api/v1/projects/{id}:
     *   patch:
     *     summary: Update a project
     *     tags: [Projects]
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
     *               description:
     *                 type: string
     *               status:
     *                 type: string
     *                 enum: [PENDING, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED]
     *               priority:
     *                 type: string
     *                 enum: [LOW, MEDIUM, HIGH, URGENT]
     *     responses:
     *       200:
     *         description: Project updated
     *       400:
     *         $ref: '#/components/responses/ProblemDetails'
     *       404:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.patch('/projects/:id', this.update);

    /**
     * @swagger
     * /api/v1/projects/{id}:
     *   delete:
     *     summary: Delete a project
     *     tags: [Projects]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: Project deleted
     *       404:
     *         $ref: '#/components/responses/ProblemDetails'
     *       500:
     *         $ref: '#/components/responses/ProblemDetails'
     */
    this.router.delete('/projects/:id', this.delete);
  }

  public getAll = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.projectService.getAllProjects();
      this.handleResult(result, req, res, next);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await this.projectService.getProjectById(id);
      this.handleResult(result, req, res, next);
    }
  );

  public create = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const parseResult = createProjectSchema.safeParse(req.body);
      if (!parseResult.success) {
        this.badRequest(res, parseResult.error.errors[0]?.message);
        return;
      }

      const result = await this.projectService.createProject(parseResult.data);
      if (!result.success) {
        this.handleResult(result, req, res, next);
        return;
      }

      this.created(res, result.value, `/api/v1/projects/${result.value.id}`);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const parseResult = updateProjectSchema.safeParse(req.body);
      if (!parseResult.success) {
        this.badRequest(res, parseResult.error.errors[0]?.message);
        return;
      }

      const result = await this.projectService.updateProject(id, parseResult.data);
      this.handleResult(result, req, res, next);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const result = await this.projectService.deleteProject(id);
      if (!result.success) {
        this.handleResult(result, req, res, next);
        return;
      }

      this.noContent(res);
    }
  );
}


